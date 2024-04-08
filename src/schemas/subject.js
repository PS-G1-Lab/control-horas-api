import z from "zod"

const subjectSchema = z.object({
	subject: z
		.string()
		.min(3, {
			message: "Nombre demasiado corto (mínimo 3 caracteres)",
		})
		.max(100, {
			message: "Nombre demasiado largo (máximo 100 caracteres)",
		}),
})

export function validateSubject(input) {
	return subjectSchema.safeParse(input)
}
