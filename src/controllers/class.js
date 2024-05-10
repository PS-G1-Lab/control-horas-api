import { ClassModel } from "../models/postgresql/class.js"

import { validateClass } from "../schemas/class.js"

export class ClassController {
	static async init(req, res) {
		const result = await ClassModel.init()

		if (result.error) {
			return res.status(500).json({ error: result.error })
		}

		res.status(201).json(result.message)
	}

	static async createClass(req, res) {
		const classData = validateClass(req.body)

		if (!classData.success)
			return res.status(400).json({ error: JSON.parse(classData.error.message) })

		const newClass = await ClassModel.createClass(classData.data)

		if (newClass.error) {
			return res.status(500).json({ error: newClass.error })
		}

		return res.status(201).json(newClass)
	}
}
