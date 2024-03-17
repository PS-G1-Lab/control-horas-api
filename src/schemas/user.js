import z from "zod"

const userSchema = z.object({
	userName: z
		.string({
			invalid_type_error: "Username must be a string just like this one",
		})
		.min(3)
		.max(255),
	email: z.string().email(),
	password: z
		.string({
			invalid_type_error: "Password must be a string just like this one",
		})
		.min(8, {
			message:
				"Password must be at least 8 characters long and contain at least one number and one letter",
		})
		.max(255, {
			message:
				"Password must be at most 255 characters long and contain at least one number and one letter",
		})
		.optional(),
	role: z.enum(["0", "1"]).optional(),
})

export function validateUser(input) {
	return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
	return userSchema.partial().safeParse(input)
}
