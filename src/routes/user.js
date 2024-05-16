import { Router } from "express"

import { UserController } from "../controllers/user.js"

export const userRouter = Router()

userRouter.post("/signup", UserController.signup)
userRouter.post("/login", UserController.login)
userRouter.post("/checkSession", UserController.checkSession)
userRouter.post("/logout", UserController.logout)
userRouter.post("/updateuser", UserController.updateUser)
userRouter.post("/updatepassword", UserController.updatePassword)
