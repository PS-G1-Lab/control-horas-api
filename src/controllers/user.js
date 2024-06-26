import { UserModel } from "../models/postgresql/user.js"
import { validatePartialUser, validatePasswordForm, validateUser } from "../schemas/user.js"
import { sendMailVerification } from "../services/mail/sendMailRegister.js"

export class UserController {
	static async init(req, res) {
		const result = await UserModel.init()

		if (result.error) {
			return res.status(500).json({ error: result.error })
		}

		res.status(201).json(result.message)
	}

	static async signup(req, res) {
		const userData = validateUser(req.body)

		if (!userData.success) {
			return res.status(400).json({ error: JSON.parse(userData.error.message) })
		}

		const passwordForm = validatePasswordForm(req.body)

		if (!passwordForm.success) {
			return res.status(400).json({ error: JSON.parse(passwordForm.error.message) })
		}

		if (passwordForm.data.password === userData.data.email) {
			return res.status(400).json({ error: "La contraseña no puede ser igual al email" })
		}

		const userExists = await UserModel.getUserIdByEmail(userData.data.email)

		if (userExists.userId) {
			return res.status(409).json({ error: "El usuario ya existe" })
		}

		const input = { ...userData.data, ...passwordForm.data }

		const newUser = await UserModel.createUser({ input })

		if (newUser.error) {
			return res.status(500).json({ error: newUser.error })
		}

		const mail = await sendMailVerification({ input })

		if (mail.error) {
			return res.status(500).json({ error: mail.error })
		}

		res.status(201).json({ message: newUser.message })
	}

	static async login(req, res) {
		const { email, password } = req.body

		if (email === undefined || password === undefined) {
			return res.status(400).json({ error: "Faltan datos" })
		}

		const userExists = await UserModel.getUserIdByEmail(email)

		if (userExists.error) {
			return res.status(404).json({ error: userExists.error })
		}

		const input = { password, userId: userExists.userId.user_id }

		const checkPassword = await UserModel.checkPasswordByUserId({ input })

		if (checkPassword.error) {
			return res.status(checkPassword.status).json({ error: checkPassword.error })
		}

		const sessionToken = await UserModel.getSessionToken(input.userId)

		if (sessionToken.error) {
			return res.status(500).json({ error: sessionToken.error })
		}

		res.status(200).json({
			sessionToken: sessionToken.sessionToken,
			userId: input.userId,
			message: "User logged in",
		})
	}

	static async checkSession(req, res) {
		const { sessionToken, userId } = req.body

		const input = { sessionToken, userId }

		const userSession = await UserModel.validateUserSession({ input })

		if (userSession.error) {
			return res.status(400).json({ error: userSession.error })
		}

		return res.status(200).json(userSession)
	}

	static async logout(req, res) {
		const { sessionToken, userId } = req.body

		const input = { sessionToken, userId }

		const userSession = await UserModel.deleteUserSession({ input })

		if (userSession.error) {
			return res.status(400).json({ error: userSession.error })
		}

		return res.status(200).json(userSession)
	}

	static async updateUser(req, res) {
		const userData = validatePartialUser(req.body)

		if (!userData.success) {
			return res.status(400).json({ error: JSON.parse(userData.error.message) })
		}

		const { userName, email } = userData.data
		const { userId, sessionToken } = req.body

		const userSession = await UserModel.validateUserSession({ input: { userId, sessionToken } })

		if (userSession.error) {
			return res.status(403).json({ error: "Error al validar sesión" })
		}

		const input = { userId, userName, email }

		const updateUser = await UserModel.updateUser({ input })

		if (updateUser.error) {
			return res.status(500).json({ error: updateUser.error })
		}

		res.status(200).json(updateUser)
	}

	static async updatePassword(req, res) {
		const passwordForm = validatePasswordForm(req.body)

		if (!passwordForm.success) {
			return res.status(400).json({ error: JSON.parse(passwordForm.error.message) })
		}

		const { password } = passwordForm.data

		const { userId, sessionToken } = req.body

		const userSession = await UserModel.validateUserSession({ input: { userId, sessionToken } })

		if (userSession.error) {
			return res.status(403).json({ error: "Error al validar sesión" })
		}

		const input = { userId, password, sessionToken }

		const updatePassword = await UserModel.updatePassword({ input })

		if (updatePassword.error) {
			return res.status(500).json({ error: updatePassword.error })
		}

		res.status(200).json(updatePassword)
	}
}
