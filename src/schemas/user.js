import z from "zod"

const userSchema = z.object({
  userName: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255).optional()
})

export function validateUser(input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input)
}
