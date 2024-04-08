import { Router } from "express"

import { SubjectController } from "../controllers/subject.js"

export const subjectRouter = Router()

subjectRouter.post("/", SubjectController.createSubject)
