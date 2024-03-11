import { randomUUID } from "node:crypto"

import { createClient } from "@libsql/client"

import dotenv from "dotenv"

import { z } from "zod"

dotenv.config({ path: "../../../.env" })

const db = () => {
	return createClient({
		url: process.env.DB_URL,
		authToken: process.env.DB_AUTH_TOKEN,
	})
}

// Definir el esquema de validación
const dataSchema = z
	.string()
	.min(8, { message: "Debe tener al menos 8 caracteres" })
	.regex(/.*\d.*/, { message: "Debe contener al menos un número" })
	.regex(/.*[!@#$&?*_].*/, { message: "Debe contener al menos un carácter especial" })
	.regex(/.*[a-z].*/, { message: "Debe contener al menos una letra minúscula" })
	.regex(/.*[A-Z].*/, { message: "Debe contener al menos una letra mayúscula" })
	.refine((value) => !/^[a-zA-Z0-9]+$/.test(value), {
		message: "No debe contener patrones de letras y/o números",
	})
  ////
export class UserModel {
	static async init() {
		// Connect to the database
		const client = db()

		// Create the table users if it doesn't exist
		await client
			.execute(
				`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY NOT NULL,
        user_name TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        reset_password_token TEXT UNIQUE DEFAULT NULL,
        reset_password_expires TIMESTAMP DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
			)
			.catch((err) => {
				return { err }
			})

		// Insert some data
		const user = await client
			.execute(
				`
      INSERT INTO users (user_id, user_name, email, is_verified, verification_token, password)
      VALUES ('${randomUUID()}', 'jcap', 'jcap@jcap.com', TRUE, '1234', '1234');
    `
			)
			.catch((err) => {
				return { err }
			})

		return { user }
	}

	static async getUserIdByUserName({ userName }) {
		const client = db()
		const userId = await client
			.execute(
				`
      SELECT user_id FROM users WHERE user_name = '${userName}';
    `
			)
			.catch((err) => {
				return { err }
			})

		if (userId === undefined) {
			return { error: "User not found" }
		}

		return { userId: userId[0].user_id }
	}

	// Función para validar datos
	static async validationData(data) {
		try {
			// Validar los datos utilizando el esquema
			dataSchema.parse(data)
			return true // Los datos son válidos
		} catch (error) {
			console.error(error.errors) // Mostrar los errores de validación
			return false // Los datos no son válidos
		}
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
