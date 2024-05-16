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
		req.body.userId = +req.body.userId

		const classData = validateClass(req.body)

		if (!classData.success) {
			return res.status(400).json({ error: JSON.parse(classData.error.message) })
		}

		const input = { ...classData.data }

		const newClass = await ClassModel.createClass({ input })

		if (newClass.error) {
			return res.status(500).json({ error: newClass.error })
		}

		return res.status(201).json(newClass)
	}

	static async deleteClass(req, res) {
		const { classId } = req.params

		const { userId, sessionToken } = req.body

		const input = { classId, userId, sessionToken }

		const deletedClass = await ClassModel.deleteClass({ input })

		if (deletedClass.error) {
			return res.status(deletedClass.status).json({ error: deletedClass.error })
		}

		return res.status(200).json(deletedClass)
	}

	static async getClasses(req, res) {
		const { userId } = req.body

		const input = { userId }

		const classes = await ClassModel.getClassesByUserId({ input })

		if (classes.error) {
			return res.status(classes.status).json({ error: classes.error })
		}

		return res.status(200).json(classes)
	}
}
