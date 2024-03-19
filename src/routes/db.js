import { Router } from "express"

import { UserController } from "../controllers/user.js"

export const dbRouter = Router()

dbRouter.post("/users", UserController.init)
