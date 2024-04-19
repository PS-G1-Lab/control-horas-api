import { createHash, randomUUID } from "node:crypto"

import dotenv from "dotenv"
import { pgp } from "pg"

dotenv.config({ path: "../../../.env" })

const db = pgp({
	user: process.env.RENDER_DB_USER,
	password: process.env.RENDER_DB_PASSWORD,
	host: process.env.RENDER_DB_HOST,
	port: process.env.RENDER_DB_PORT,
	database: process.env.RENDER_DB,
})

export class UserModel {
	static async init() {
		const createUsersTable = await db
			.none(
				`
				CREATE TABLE IF NOT EXISTS users (
					user_id SERIAL PRIMARY KEY,
					user_name TEXT NOT NULL,
					email TEXT NOT NULL UNIQUE,
					password TEXT NOT NULL,
					is_verified BOOLEAN DEFAULT FALSE,
					verification_token TEXT UNIQUE DEFAULT NULL,
					reset_password_token TEXT UNIQUE DEFAULT NULL,
					reset_password_expires TIMESTAMP DEFAULT NULL,
					role INTEGER DEFAULT 0,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					session_token UUID UNIQUE DEFAULT NULL
				);
				`
			)
			.catch((error) => {
				return { error }
			})

		if (createUsersTable.error) {
			return { error: createUsersTable.error }
		}

		return { message: "Tabla 'users' creada" }
	}

	static async createUser({ input }) {
		const { userName, email, password, role } = input

		const encryptedPassword = await this.encryptPassword(password)

		const newUser = await db
			.none(
				`
				INSERT INTO users (user_name, email, password, role)
				VALUES ($1, $2, $3, $4)
				`,
				[userName, email, encryptedPassword, +role]
			)
			.catch((error) => {
				return { error }
			})

		if (newUser.error) {
			return { error: "Error al crear el usuario" }
		}

		return { message: "Usuario creado" }
	}

	static async getUserIdByEmail(email) {
		const dbData = await db
			.oneOrNone(
				`
				SELECT user_id FROM users WHERE email = $1
				`,
				[email]
			)
			.catch((error) => {
				return { error }
			})

		const userId = dbData?.user_id

		if (userId === undefined) {
			return { error: "Usuario no encontrado" }
		}

		return { userId }
	}

	static async checkPasswordByUserId({ input }) {
		const { userId, password } = input

		const encryptedPassword = await this.encryptPassword(password)

		const dbPassword = await db
			.oneOrNone(
				`
				SELECT password FROM users WHERE user_id = $1
				`,
				[userId]
			)
			.catch((error) => {
				return { error }
			})

		if (dbPassword.error) {
			return { status: 500, error: "Error de servidor" }
		}

		if (dbPassword?.password !== encryptedPassword) {
			return { status: 400, error: "Contraseña incorrecta" }
		}

		return { message: "Contraseña correcta" }
	}

	static async getSessionToken(userId) {
		const sessionToken = randomUUID()

		const insertSessionToken = await db
			.none(
				`
				UPDATE users SET session_token = $1 WHERE user_id = $2
				`,
				[sessionToken, userId]
			)
			.catch((error) => {
				return { error }
			})

		if (insertSessionToken.error) {
			return { error: insertSessionToken.error }
		}

		return { sessionToken }
	}

	static async getUserNameByUserId({ input }) {
		const { userId } = input

		const dbData = await db
			.oneOrNone(
				`
				SELECT user_name FROM users WHERE user_id = $1
				`,
				[userId]
			)
			.catch((error) => {
				return { error }
			})

		const userName = dbData?.user_name

		if (userName === undefined) {
			return { error: "Usuario no encontrado" }
		}

		return { userName }
	}

	static async validateUserSession({ input }) {
		const { sessionToken, userName } = input

		const dbData = await db
			.oneOrNone(
				`
				SELECT user_name, email, role, is_verified FROM users WHERE session_token = $1 AND user_name = $2
				`,
				[sessionToken, userName]
			)
			.catch((error) => {
				return { error }
			})

		const userData = dbData

		if (userData === undefined) {
			return { error: "Usuario no encontrado" }
		}

		return { userData }
	}

	static async encryptPassword(password) {
		const encryptedPassword = createHash("sha512").update(password).digest("hex")
		return encryptedPassword
	}
}
