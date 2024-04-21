import { Router } from "express"

import { UserController } from "../controllers/user.js"

// import { SubjectController } from "../controllers/subject.js

export const dbRouter = Router()

dbRouter.post("/users", UserController.init)

// dbRouter.post("/subjects", SubjectController.init)
