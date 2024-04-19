import { ClassModel } from "../models/turso/class.js"

export class ClassController {
	static async init(req, res) {
		const result = await ClassModel.init()

		if (result.error) {
			return res.status(500).json({ error: result.error })
		}

		res.status(201).json(result.message)
	}
}
