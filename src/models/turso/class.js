import { createClient } from "@libsql/client"

import dotenv from "dotenv"

dotenv.config({ path: "./././.env" })

// const db = createClient({
// 	url: process.env.DB_URL,
// 	authToken: process.env.DB_AUTH_TOKEN,
// })

const db = createClient({
	url: "http://127.0.0.1:8080",
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
					subject_id INTEGER NOT NULL,
					students TEXT DEFAULT NULL,
					start_at TIMESTAMP NOT NULL,
					end TIMESTAMP NOT NULL,
					date DATE NOT NULL,
					description TEXT DEFAULT NULL,
					price DECIMAL(1, 2) NOT NULL,
					FOREIGN KEY (user_id) REFERENCES users(user_id),
					FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
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
}
