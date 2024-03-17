import { UserModel } from "../models/turso/user.js"
import { validateUser } from "../schemas/user.js"

export class UserController {
	static async init(req, res) {
		const result = await UserModel.init()

		if (result.error) {
			return res.status(500).json({ error: result.error })
		}

		res.status(result.status).json(result.message)
	}

	static async signup(req, res) {
		// eslint-disable-next-line no-console
		console.log(req.body)
		const result = validateUser(req.body)

		if (!result.success) {
			return res.status(400).json({ error: JSON.parse(result.error.message) })
		}

		const newUser = await UserModel.signup({ input: result.data })

		if (newUser.error) {
			return res.status(newUser.status).json({ error: newUser.error })
		}

		res.status(newUser.status).json(newUser.user)
	}

	// static async getById (req, res) {
	//   const { id } = req.params
	//   const review = await ReviewModel.getById({ id })
	//   if (review) return res.json(review)
	//   res.status(404).json({ message: 'Review not found' })
	// }

	// static async create (req, res) {
	//   const result = validateReview(req.body)

	//   if (!result.success) {
	//     return res.status(400).json({ error: JSON.parse(result.error.message) })
	//   }

	//   const newReview = await ReviewModel.create({ input: result.data })

	//   res.status(201).json(newReview)
	// }

	// static async delete (req, res) {
	//   const { id } = req.params

	//   const result = await MovieModel.delete({ id })

	//   if (result === false) {
	//     return res.status(404).json({ message: 'Movie not found' })
	//   }

	//   return res.json({ message: 'Movie deleted' })
	// }

	// static async update (req, res) {
	//   const result = validatePartialMovie(req.body)

	//   if (!result.success) {
	//     return res.status(400).json({ error: JSON.parse(result.error.message) })
	//   }

	//   const { id } = req.params

	//   const updatedMovie = await MovieModel.update({ id, input: result.data })

	//   return res.json(updatedMovie)
	// }
}
