import express, { json } from "express"

import { corsMiddleware } from "./middlewares/cors.js"
import { reviewsRouter } from "./routes/reviews.js"
import { userRouter } from "./routes/user.js"

const app = express()
app.use(json())
app.disable("x-powered-by")

app.use(corsMiddleware())
app.use("/user", userRouter)
app.use("/reviews", reviewsRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on http://localhost:${PORT}`)
})
