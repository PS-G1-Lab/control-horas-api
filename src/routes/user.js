import { Router } from "express"

import { UserController } from "../controllers/user.js"

export const userRouter = Router()

userRouter.post("/signup", UserController.signup)
userRouter.post("/login", UserController.login)
userRouter.post("/data", UserController.data)
// userRouter.get('/:userName', UserController.getUserByUserName)
