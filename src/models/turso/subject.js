import { createClient } from "@libsql/client"

import dotenv from "dotenv"

dotenv.config({ path: "./././.env" })

const db = createClient({
	url: process.env.TURSO_URL,
	authToken: process.env.TURSO_TOKEN,
})

export class SubjectModel {
	static async init() {
		const createSubjectsTable = await db
			.execute(
				`
				CREATE TABLE IF NOT EXISTS subjects (
					subject_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
					subject TEXT NOT NULL UNIQUE CHECK(length(subject) >= 3 AND length(subject) <= 100)
				);
				`
			)
			.catch((error) => {
				return { error }
			})

		if (createSubjectsTable.error) {
			return { error: createSubjectsTable.error }
		}

		return { message: "Tabla 'subjects' creada" }
	}

	static async createSubject(subjectName) {
		const newSubject = await db
			.execute({
				sql: "INSERT INTO subjects (subject) VALUES (?)",
				args: [subjectName],
			})
			.catch((error) => {
				return { error }
			})

		if (newSubject.error) {
			return { error: newSubject.error }
		}

		return { message: "Materia creada", subject: subjectName }
	}
}
