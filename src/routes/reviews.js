import { Router } from "express"

import { ReviewsController } from "../controllers/reviews.js"

export const reviewsRouter = Router()

reviewsRouter.get("/init", ReviewsController.init)

// reviewsRouter.get('/', ReviewsController.getAll)
// reviewsRouter.post('/reviews', ReviewsController.create)
// reviewsRouter.get('/reviews/:id', ReviewsController.getById)
