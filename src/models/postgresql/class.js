import dotenv from "dotenv"
import { Client } from "pg"

dotenv.config({ path: "./.env" })

const client = new Client({
	connectionString: process.env.POSTGRES_URL,
})

client.connect()

export class ClassModel {
	static async init() {
		const createClassesTable = `
      CREATE TABLE IF NOT EXISTS classes (
        class_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        students INTEGER DEFAULT 0,
        start_at TIMESTAMP NOT NULL,
        end TIMESTAMP NOT NULL,
        date TIMESTAMP NOT NULL,
        description TEXT DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `

		try {
			await client.query(createClassesTable)
			return { message: "Tabla 'classes' creada" }
		} catch (error) {
			return { error }
		}
	}

	static async createClass(classData) {
		const { userId, title, subject, startAt, end, date, description } = classData

		const subjectName = subject
			.toUpperCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036F]/g, "")

		try {
			await client.query(
				`
        INSERT INTO classes (user_id, title, subject, start_at, end, date, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
				[userId, title, subjectName, startAt, end, date, description]
			)
			return { message: "Clase creada" }
		} catch (error) {
			console.log(error)
			return { error: "Error al crear clase" }
		}
	}
}
