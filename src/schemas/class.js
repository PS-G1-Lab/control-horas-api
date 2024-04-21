import z from "zod"

const classSchema = z.object({
	userId: z.number().int().positive(),
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
	startAt: z.number().int().positive(),
	end: z.number().int().positive(),
	date: z.number(),
	description: z.string(),
})

export function validateClass(input) {
	return classSchema.safeParse(input)
}
