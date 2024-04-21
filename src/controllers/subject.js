import { SubjectModel } from "../models/turso/subject.js"

import { validateSubject } from "../schemas/subject.js"

export class SubjectController {
	static async init(req, res) {
		const result = await SubjectModel.init()

		if (result.error) {
			return res.status(500).json({ error: result.error })
		}

		res.status(201).json(result.message)
	}

	static async createSubject(req, res) {
		const subjectData = validateSubject(req.body)

		if (!subjectData.success) {
			return res.status(400).json({ error: JSON.parse(subjectData.error.message) })
		}

		const subjectName = subjectData.data.subject
			.toUpperCase()
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036F]/g, "")

		// uppercase and trim and replace accents with their non-accented equivalent
		const subject = await SubjectModel.createSubject(subjectName)

		if (subject.error) {
			return res.status(500).json({ error: subject.error })
		}

		return res.status(201).json(subject)
	}

	static async getSubjectIdByName(req, res) {
		const subjectName = req.params.name

		const subject = await SubjectModel.getSubjectIdByName(subjectName)

		if (subject.error) {
			return res.status(500).json({ error: subject.error })
		}

		if (!subject.data) {
			return res.status(404).json({ error: "Subject not found" })
		}

		return res.status(200).json(subject)
	}
}
