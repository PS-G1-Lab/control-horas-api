import { createClient } from "@libsql/client"

import dotenv from "dotenv"

dotenv.config({ path: "./././.env" })

const db = createClient({
	url: process.env.TURSO_URL,
	authToken: process.env.TURSO_TOKEN,
})

export class ClassModel {
	static async init() {
		const createClassesTable = await db
			.execute(
				`
				CREATE TABLE IF NOT EXISTS classes (
					class_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
					user_id INTEGER NOT NULL,
					title TEXT NOT NULL,
					subject TEXT NOT NULL,
					students TEXT DEFAULT "",
					start_at TIMESTAMP NOT NULL,
					end TIMESTAMP NOT NULL,
					date DATE NOT NULL,
					description TEXT DEFAULT NULL,
					FOREIGN KEY (user_id) REFERENCES users(user_id)
				);
				`
			)
			.catch((error) => {
				return { error }
			})

		if (createClassesTable.error) {
			return { error: createClassesTable.error }
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

		const createClass = await db
			.execute({
				sql: `
				INSERT INTO classes (
					user_id, title, subject, start_at, end, date, description
				)
				VALUES (?, ?, ?, ?, ?, ?, ?)
				`,
				args: [userId, title, subjectName, startAt, end, date, description],
			})
			.catch((error) => {
				return { error }
			})

		if (createClass.error) {
			console.log(createClass)
			return { error: createClass.error }
		}

		return { message: "Clase creada" }
	}
}
