import dotenv from "dotenv"
import pg from "pg"

dotenv.config({ path: "./././.env" })

const { Client } = pg

const client = new Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	connectionString: process.env.DB_CONNECTION_STRING,
})

await client.connect()

export class ClassModel {
	static async init() {
		const createClassesTable = await client
			.query(
				`
				CREATE TABLE IF NOT EXISTS classes (
					class_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
					user_id INTEGER NOT NULL,
					title TEXT NOT NULL,
					subject TEXT NOT NULL,
					students INTEGER DEFAULT 0,
					start_at TEST NOT NULL,
					end TEST NOT NULL,
					date TEST NOT NULL,
					description TEXT DEFAULT NULL,
					FOREIGN KEY (user_id) REFERENCES users(user_id)
				);
				`
			)
			.catch((error) => {
				return { error }
			})

		if (createClassesTable.error) {
			return { error: "Error al crear la tabla 'classes'" }
		}

		return { message: "Tabla 'classes' creada" }
	}

	static async createClass(classData) {
		const { userId, title, subject, startAt, end, date, description } = classData

		const subjectName = subject
			.toUpperCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036F]/g, "")

		const createClass = await client
			.query(
				`
        INSERT INTO classes (user_id, title, subject, start_at, end, date, description)
				VALUES ($1, $2, $3, $4, $5, $6, $7)
				`,
				[userId, title, subjectName, startAt, end, date, description]
			)
			.catch((error) => {
				return { error }
			})

		if (createClass.error) {
			return { error: "Error al crear clase" }
		}

		return { message: "Clase creada" }
	}
}
