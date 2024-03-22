import z from "zod"

const userSchema = z.object({
	userName: z
		.string()
		.min(3, {
			message: "Nombre demasiado corto (mínimo 3 caracteres)",
		})
		.max(100, {
			message: "Nombre demasiado largo (máximo 100 caracteres)",
		}),
	email: z.string().email({
		message: "Debe ser un email válido",
	}),
	role: z.enum(["0", "1"]).optional(),
})

const passwordForm = z
	.object({
		password: z
			.string()
			.min(8, {
				message: "Contraseña demasiado corta (mínimo 8 caracteres)",
			})
			.max(30, {
				message: "Contraseña demasiado larga (máximo 30 caracteres)",
			})
			.regex(/.*\d.*/, { message: "Debe haber al menos un número" })
			.regex(/.*[!@#$&?*_].*/, { message: "Debe haber al menos un carácter especial" })
			.regex(/.*[a-z].*/, { message: "Debe haber al menos una letra minúscula" })
			.regex(/.*[A-Z].*/, { message: "Debe haber al menos una letra mayúscula" })
			.refine((value) => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value), {
				message: "No deben haber patrones de email",
			})
			.refine((value) => !/^[a-zA-Z0-9]+$/.test(value), {
				message: "No deben haber patrones de letras y/o números",
			}),
		confirmPassword: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	})

export function validateUser(input) {
	return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
	return userSchema.partial().safeParse(input)
}

export function validatePasswordForm(input) {
	return passwordForm.safeParse(input)
}

export function validatePartialPasswordForm(input) {
	return passwordForm.partial().safeParse(input)
}
