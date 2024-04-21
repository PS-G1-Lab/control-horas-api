import { Router } from "express"

import { ClassController } from "../controllers/class.js"
import { SubjectController } from "../controllers/subject.js"
import { UserController } from "../controllers/user.js"

export const dbRouter = Router()

dbRouter.post("/users", UserController.init)
dbRouter.post("/subjects", SubjectController.init)
dbRouter.post("/classes", ClassController.init)
