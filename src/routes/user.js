import { Router } from "express"

import { UserController } from "../controllers/user.js"

export const userRouter = Router()

userRouter.get('/:userName', UserController.userData)

userRouter.post("/signup", UserController.signup)
userRouter.post("/login", UserController.login)
userRouter.post("/checkSession", UserController.checkSession)
userRouter.post("/logout", UserController.logout)

