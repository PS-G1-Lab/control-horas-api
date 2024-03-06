import { ReviewModel } from "../models/turso/reviews.js"
import { validateReview } from "../schemas/reviews.js"

export class ReviewsController {
	static async init(req, res) {
		const init = await ReviewModel.init()
		return res.json(init)
	}

	static async getAll(req, res) {
		const reviews = await ReviewModel.getAll()
		res.json(reviews)
	}

	static async getById(req, res) {
		const { id } = req.params
		const review = await ReviewModel.getById({ id })
		if (review) return res.json(review)
		res.status(404).json({ message: "Review not found" })
	}

	static async create(req, res) {
		const result = validateReview(req.body)

		if (!result.success) {
			return res.status(400).json({ error: JSON.parse(result.error.message) })
		}

		const newReview = await ReviewModel.create({ input: result.data })

		res.status(201).json(newReview)
	}
}
