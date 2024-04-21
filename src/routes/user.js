import { Router } from "express"

import { UserController } from "../controllers/user.js"

export const userRouter = Router()

userRouter.post("/signup", UserController.signup)
userRouter.post("/login", UserController.login)
userRouter.post("/data", UserController.data)
userRouter.post("/checkSession", UserController.checkSession)

// TODO: userRouter.post("/logout", UserController.logout)

// userRouter.get('/:userName', UserController.getUserByUserName)
