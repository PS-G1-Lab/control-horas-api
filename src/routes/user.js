import { Router } from 'express'

import { UserController } from '../controllers/user.js'

export const userRouter = Router()

userRouter.get('/init', UserController.init)

// userRouter.post('/signup', UserController.signup)
// userRouter.post('/login', UserController.login)
// userRouter.get('/:userName', UserController.getUserByUserName)
