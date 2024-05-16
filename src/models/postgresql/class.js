import dotenv from "dotenv"
import pg from "pg"
import { UserModel } from "./user.js"

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

client.connect()

export class ClassModel {
	static async init() {
		const createClassesTable = await client
			.query(
				`
        CREATE TABLE IF NOT EXISTS classes (
          class_id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          subject TEXT NOT NULL,
          students INTEGER DEFAULT 0,
          start_at TEXT NOT NULL,
          end_time TEXT NOT NULL,
          date TEXT NOT NULL,
          description TEXT DEFAULT NULL,
          FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
        `
			)
			.catch((error) => {
				return { error }
			})

		if (createClassesTable.error) {
			return { error: "Error al crear tabla 'classes'" }
		}

		return { message: "Tabla 'classes' creada" }
	}

	static async createClass({ input }) {
		const { userId, title, subject, startAt, endTime, date, description } = input

		const subjectName = subject
			.toUpperCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036F]/g, "")

		const newClass = await client
			.query(
				`
        INSERT INTO classes (user_id, title, subject, start_at, end_time, date, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
				[userId, title, subjectName, startAt, endTime, date, description]
			)
			.catch((error) => {
				return { error }
			})

		if (newClass.error) {
			return { error: "Error al crear clase" }
		}

		const classId = await this.getLastClassIdAdded()

		if (classId.error) {
			return { error: classId.error }
		}

		return { classId, message: "Clase creada" }
	}

	static async getLastClassIdAdded() {
		const lastClassId = await client
			.query(
				`
				SELECT class_id FROM classes ORDER BY class_id DESC LIMIT 1;
				`
			)
			.catch((error) => {
				return { error }
			})

		if (lastClassId.error) {
			return { error: "Error al buscar última clase" }
		}

		const classId = lastClassId.rows[0].class_id

		if (classId === undefined) {
			return { error: "Error al obtener id de clase" }
		}

		return classId
	}

	static async deleteClass({ input }) {
		const { classId, userId, sessionToken } = input

		const userClass = await client
			.query(
				`
				SELECT user_id FROM classes WHERE class_id = $1;
				`,
				[classId]
			)
			.catch((error) => {
				return { error }
			})

		if (userClass.error) {
			return { status: 500, error: "Error al buscar clase" }
		}

		let dbUserId

		try {
			dbUserId = userClass.rows[0].user_id
		} catch (error) {
			dbUserId = undefined
		}

		if (dbUserId === undefined) {
			return { status: 404, error: "Clase no encontrada" }
		}

		if (dbUserId !== userId) {
			return { status: 403, error: "No tienes permisos para eliminar esta clase" }
		}

		const userSession = await UserModel.validateUserSession({ input: { userId, sessionToken } })

		if (userSession.error) {
			return { status: 403, error: "Error al validar sesión" }
		}

		const deletedClass = await client
			.query(
				`
				DELETE FROM classes WHERE class_id = $1;
				`,
				[classId]
			)
			.catch((error) => {
				return { error }
			})

		if (deletedClass.error) {
			return { status: 500, error: "Error al eliminar clase" }
		}

		return { message: "Clase eliminada" }
	}

	static async getClassesByUserId({ input }) {
		const { userId } = input

		const classes = await client
			.query(
				`
        SELECT * FROM classes WHERE user_id = $1;
        `,
				[userId]
			)
			.catch((error) => {
				return { error }
			})

		if (classes.error) {
			return { error: "Error al buscar clases" }
		}

		return classes
	}
}
