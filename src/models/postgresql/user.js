import dotenv from "dotenv"
import { createHash, randomUUID } from "node:crypto"
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

export class UserModel {
	static async init() {
		const createUsersTable = await client
			.query(
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

		return { message: "Tabla 'users' creada" }
	}

	static async createUser({ input }) {
		const { userName, email, password, role } = input

		const encryptedPassword = await this.encryptPassword(password)

		const newUser = await client
			.query(
				`
				INSERT INTO users (user_name, email, password, role)
				VALUES ($1, $2, $3, $4);
				`,
				[userName, email, encryptedPassword, +role]
			)
			.catch((error) => {
				return { error }
			})

		console.log(await this.getUserIdByEmail(email))

		return { message: "Usuario creado" }
	}

	static async getUserIdByEmail(email) {
		const dbData = await client
			.query(
				`
				SELECT user_id FROM users WHERE email = $1
				`,
				[email]
			)
			.catch((error) => {
				return { error }
			})

		const userId = dbData.rows[0]

		if (userId === undefined) {
			return { error: "Usuario no encontrado" }
		}

		return { userId }
	}

	static async checkPasswordByUserId({ input }) {
		const { userId, password } = input

		const encryptedPassword = await this.encryptPassword(password)

		const dbPassword = await client
			.query(
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

		const insertSessionToken = await client
			.query(
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

		const dbData = await client
			.query(
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

		const dbData = await client
			.query(
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
