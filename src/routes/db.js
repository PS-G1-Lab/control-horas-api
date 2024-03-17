import { Router } from "express"

import { UserController } from "../controllers/user.js"

export const dbRouter = Router()

dbRouter.get("", UserController.init)
