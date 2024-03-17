import { randomUUID } from "node:crypto"

import { createClient } from "@libsql/client"

import dotenv from "dotenv"

dotenv.config({ path: "../../../.env" })

const db = () => {
	return createClient({
		url: process.env.DB_URL,
		authToken: process.env.DB_AUTH_TOKEN,
	})
}

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
					password TEXT NOT NULL,
					is_verified BOOLEAN DEFAULT FALSE,
					verification_token TEXT UNIQUE NOT NULL,
					reset_password_token TEXT UNIQUE DEFAULT NULL,
					reset_password_expires TIMESTAMP DEFAULT NULL,
					role ENUM(0, 1) DEFAULT 0,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      	);
    		` // role 0 = student, role 1 = teacher
			)
			.catch((err) => {
				return { err }
			})

		return { status: 201, message: "Table created" }
	}

	static async getUserIdByUserName({ userName }) {
		const client = db()
		const userId = await client
			.execute(
				`
      	SELECT user_id FROM users WHERE user_name = '${userName}';
    		`
			)
			.catch((error) => {
				return { error }
			})

		if (userId === undefined) {
			return { error: "User not found" }
		}

		return { userId: userId[0].user_id }
	}

	static async signup({ input }) {
		const client = db()
		const user = await client
			.execute(
				`
				INSERT INTO users (user_id, user_name, email, password, role)
				VALUES (
					'${randomUUID()}', '${input.userName}', '${input.email}', '${input.password}', '${input.role}'
				);
				`
			)
			.catch((err) => {
				return { err }
			})

		if (user === undefined) {
			return { error: "User not created" }
		}

		return user[0]
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
