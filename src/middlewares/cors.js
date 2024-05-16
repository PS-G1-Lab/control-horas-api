import cors from "cors"

const ACCEPTED_ORIGINS = [
	"http://localhost:8080",
	"http://localhost:1234",
	"http://localhost:4321",
	"http://localhost:10000",
	"control-horas-xi.vercel.app",
	// Add the production URL
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
	cors({
		origin: (origin, callback) => {
			if (acceptedOrigins.includes(origin)) {
				return callback(null, true)
			}

			if (!origin) {
				return callback(null, true)
			}

			return callback(new Error("Not allowed by CORS"))
		},
	})
