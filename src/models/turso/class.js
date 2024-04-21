import { createClient } from "@libsql/client"

import dotenv from "dotenv"

dotenv.config({ path: "./././.env" })

const db = createClient({
	url: process.env.DB_URL,
	authToken: process.env.DB_AUTH_TOKEN,
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
					students TEXT DEFAULT NULL,
					start_at TIMESTAMP NOT NULL,
					end TIMESTAMP NOT NULL,
					date DATE NOT NULL,
					description TEXT DEFAULT NULL,
					price DECIMAL(1, 2) NOT NULL,
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
		const { user_id, title, subject, start_at, end, date, description, price } = classData

		const subjectName = subject
			.toUpperCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036F]/g, "")

		const createClass = await db
			.execute(
				`
				INSERT INTO classes (user_id, title, subject, start_at, end, date, description, price)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)
				`,
				[user_id, title, subjectName, start_at, end, date, description, price]
			)
			.catch((error) => {
				return { error }
			})

		if (createClass.error) {
			return { error: createClass.error }
		}

		return { message: createClass }
	}
}
