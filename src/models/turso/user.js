import { createHash, randomUUID } from "node:crypto"

import { createClient } from "@libsql/client"

import dotenv from "dotenv"

dotenv.config({ path: "./././.env" })

const db = createClient({
	url: process.env.DB_URL,
	authToken: process.env.DB_AUTH_TOKEN,
})

// const db = createClient({
// 	url: "http://127.0.0.1:8080",
// })

export class UserModel {
	static async init() {
		const createUsersTable = await db
			.execute(
				`
				CREATE TABLE IF NOT EXISTS users (
					user_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
					user_name TEXT NOT NULL,
					email TEXT NOT NULL UNIQUE,
					password TEXT NOT NULL,
					is_verified BOOLEAN DEFAULT FALSE,
					verification_token TEXT UNIQUE DEFAULT NULL,
					reset_password_token TEXT UNIQUE DEFAULT NULL,
					reset_password_expires TIMESTAMP DEFAULT NULL,
					role ENUM(0, 1) DEFAULT 0,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					session_token UUID UNIQUE DEFAULT NULL
				);
				` // role 0 = student, role 1 = teacher
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
			.execute({
				sql: "INSERT INTO users (user_name, email, password, role) VALUES (?, ?, ?, ?)",
				args: [userName, email, encryptedPassword, +role],
			})
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
			.execute({
				sql: "SELECT user_id FROM users WHERE email = ?",
				args: [email],
			})
			.catch((error) => {
				return { error }
			})

		const userId = dbData?.rows[0]

		if (userId === undefined) {
			return { error: "Usuario no encontrado" }
		}

		return { userId: userId.user_id }
	}

	static async checkPasswordByUserId({ input }) {
		const { userId, password } = input

		const encryptedPassword = await this.encryptPassword(password)

		const dbPassword = await db
			.execute({
				sql: "SELECT password FROM users WHERE user_id = ?",
				args: [userId],
			})
			.catch((error) => {
				return { error }
			})

		if (dbPassword.error) {
			return { status: 500, error: "Error de servidor" }
		}

		if (dbPassword.rows[0].password !== encryptedPassword) {
			return { status: 400, error: "Contraseña incorrecta" }
		}

		return { message: "Contraseña correcta" }
	}

	static async getSessionToken(userId) {
		const sessionToken = randomUUID()

		const insertSessionToken = await db
			.execute({
				sql: "UPDATE users SET session_token = ? WHERE user_id = ?",
				args: [sessionToken, userId],
			})
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
			.execute({
				sql: "SELECT user_name FROM users WHERE user_id = ?",
				args: [userId],
			})
			.catch((error) => {
				return { error }
			})

		const userName = dbData?.rows[0]

		if (userName === undefined) {
			return { error: "Usuario no encontrado" }
		}

		return { userName: userName.user_name }
	}

	static async validateUserSession({ input }) {
		const { sessionToken, userName } = input

		const dbData = await db
			.execute({
				sql: "SELECT user_name, email, role, is_verified FROM users WHERE session_token = ? AND user_name = ?",
				args: [sessionToken, userName],
			})
			.catch((error) => {
				return { error }
			})

		const userData = dbData?.rows[0]

		if (userData === undefined) {
			return { error: "Usuario no encontrado" }
		}

		return { userData }
	}

	static async encryptPassword(password) {
		const encryptedPassword = createHash("sha512").update(password).digest("hex")
		return encryptedPassword
	}

	// export class MovieModel {
	//   static async getAll ({ genre }) {
	//     const db = await connect()

	//     if (genre) {
	//       return db.find({
	//         genre: {
	//           $elemMatch: {
	//             $regex: genre,
	//             $options: 'i'
	//           }
	//         }
	//       }).toArray()
	//     }

	//     return db.find({}).toArray()
	//   }

	//   static async getById ({ id }) {
	//     const db = await connect()
	//     const objectId = new ObjectId(id)
	//     return db.findOne({ _id: objectId })
	//   }

	//   static async create ({ input }) {
	//     const db = await connect()

	//     const { insertedId } = await db.insertOne(input)

	//     return {
	//       id: insertedId,
	//       ...input
	//     }
	//   }

	//   static async delete ({ id }) {
	//     const db = await connect()
	//     const objectId = new ObjectId(id)
	//     const { deletedCount } = await db.deleteOne({ _id: objectId })
	//     return deletedCount > 0
	//   }

	//   static async update ({ id, input }) {
	//     const db = await connect()
	//     const objectId = new ObjectId(id)

	//     const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })

	//     if (!ok) return false

	//     return value
	//   }
}
