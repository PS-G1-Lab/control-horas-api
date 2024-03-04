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
      return { step: 'create', err }
    })

    const userIdConsult = await client.execute(`
      SELECT user_id FROM users WHERE user_name = 'jcap';
    `).catch(err => {
      return { step: 'select', err }
    })

    if (userIdConsult.rows.length === 0) return { status: 404, error: 'User not found' }

    const userId = userIdConsult.rows[0].user_id

    const result = await this.createNewReview({
      title: 'your title here',
      content: 'your content here',
      rate: 1,
      userId
    })

    return { result }
  }

  static async getAll () {
    const client = db()
    const query = 'SELECT * FROM reviews'
    const result = await client.execute(query)
    return result
  }

  static async createNewReview ({ title, content, rate, userId }) {
    const client = db()
    const result = await client.execute({
      sql: 'INSERT INTO reviews VALUES (:reviewId, :title, :content, :rate, :userId)',
      args: { reviewId: randomUUID(), title, content, rate, userId }
    })
    return result
  }
}
