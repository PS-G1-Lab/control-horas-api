import z from "zod"

const classSchema = z.object({
	user_id: z.number().int().positive(),
	title: z
		.string()
		.min(3, {
			message: "Nombre demasiado corto (mínimo 3 caracteres)",
		})
		.max(100, {
			message: "Nombre demasiado largo (máximo 100 caracteres)",
		}),
	subject: z
		.string()
		.min(3, {
			message: "Nombre demasiado corto (mínimo 3 caracteres)",
		})
		.max(100, {
			message: "Nombre demasiado largo (máximo 100 caracteres)",
		}),
	students: z.string().optional(),
	start_at: z.number().int().positive(),
	end: z.number().int().positive(),
	date: z.string(),
	description: z.string(),
	price: z.number(),
})

export function validateClass(input) {
	return classSchema.safeParse(input)
}
