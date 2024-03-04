import { randomUUID } from 'node:crypto'
import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config({ path: '../../../.env' })

const db = () => {
  return createClient({
    url: process.env.DB_URL,
    authToken: process.env.DB_AUTH_TOKEN
  })
}

export class ReviewModel {
  static async init () {
    const client = db()

    await client.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        review_id UUID PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        rate INT NOT NULL,
        user_id UUID NOT NULL,
        FOREIGN KEY (user_id) 
          REFERENCES users (user_id)
      );
    `).catch(err => {
      console.error(err)
    })

    const userID = await client.execute(`
      SELECT user_id FROM users WHERE user_name = 'jcap';
    `).catch(err => {
      console.error(err)
    })

    console.log(userID)

    if (userID === undefined) {
      return { error: 'User not found' }
    }

    const review = await client.execute(`
      INSERT INTO reviews (review_id, title, content, rate, user_id)
      VALUES ('${randomUUID()}', 'title', 'content', 3, '${userID}');'
    `)

    return { review }
  }

  static async getAll () {
    const client = db()
    const query = 'SELECT * FROM reviews'
    const result = await client.execute(query)
    return result
  }

  static async createNewReview ({ title, content, rate, userId }) {
    // TODO: Implement the createNewReview method
    const client = db()
    const query = 'INSERT INTO reviews (review_id, title, content, rate) VALUES (?, ?, ?)' // TODO: Get the values from the petition
    const result = await client.execute(query)
    return result
  }
}
