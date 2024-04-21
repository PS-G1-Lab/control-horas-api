import { Router } from "express"

import { ClassController } from "../controllers/class.js"

export const classRouter = Router()

classRouter.post("/", ClassController.createClass)
