import express, { json, urlencoded } from "express"

import { corsMiddleware } from "./middlewares/cors.js"

import { dbRouter } from "./routes/db.js"
import { subjectRouter } from "./routes/subject.js"
import { userRouter } from "./routes/user.js"

// import { reviewsRouter } from "./routes/reviews.js"

const app = express()
app.disable("x-powered-by")
app.use(json())
app.use(urlencoded({ extended: true }))

app.use(corsMiddleware())
app.use("/db", dbRouter)
app.use("/user", userRouter)
app.use("/subject", subjectRouter)

// app.use("/reviews", reviewsRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on http://localhost:${PORT}`)
})
