import { Router } from "express"

// import { SubjectController } from "../controllers/subject.js"
import { UserController } from "../controllers/user.js"

export const dbRouter = Router()

dbRouter.post("/users", UserController.init)
// dbRouter.post("/subjects", SubjectController.init)
