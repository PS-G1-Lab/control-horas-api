import { ClassModel } from "../models/postgresql/class.js"
import { UserModel } from "../models/postgresql/user.js"

import { validateClass } from "../schemas/class.js"

import { sendMailNextClass } from "../services/mail/sendMailNextClass.js"

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
		const { classId } = req.body

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
			return res.status(500).json({ error: classes.error })
		}

		return res.status(200).json(classes)
	}

	static async getAllClasses(req, res) {
		const classes = await ClassModel.getAllClasses()

		if (classes.error) {
			return res.status(500).json({ error: classes.error })
		}

		return res.status(200).json(classes)
	}

	static async getClassById(req, res) {
		const { classId } = req.body

		const input = { classId }

		const classData = await ClassModel.getClassById({ input })

		if (classData.error) {
			return res.status(500).json({ error: classData.error })
		}

		return res.status(200).json(classData)
	}

	static async inscribeUser(req, res) {
		const { classId, userId } = req.body

		const email = await UserModel.getEamilByUserId({ input })

		if (email.error) {
			return res.status(500).json({ error: email.error })
		}

		const classData = await ClassModel.getClassById({ input })

		if (classData.error) {
			return res.status(500).json({ error: classData.error })
		}

		const input = { classId, userId, title: classData.title, email: email.email }

		const inscribed = await ClassModel.inscribeUserToClass({ input })

		if (inscribed.error) {
			return res.status(500).json({ error: inscribed.error })
		}

		const mail = await sendMailNextClass({ input })

		if (mail.error) {
			return res.status(500).json({ error: mail.error })
		}

		return res.status(200).json(inscribed)
	}
}
