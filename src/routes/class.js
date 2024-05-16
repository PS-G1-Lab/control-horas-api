import { Router } from "express"

import { ClassController } from "../controllers/class.js"

export const classRouter = Router()

classRouter.post("/", ClassController.createClass)
classRouter.post("/delete/:classId", ClassController.deleteClass)
classRouter.post("/getclasses/:userId", ClassController.getClasses)
