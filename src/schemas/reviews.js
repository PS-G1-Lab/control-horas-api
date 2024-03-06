import z from "zod"

const reviewSchema = z.object({
  title: z.string({
    invalid_type_error: "Review title must be a string",
    required_error: "Review title is required"
  }),
  rate: z.number({
    invalid_type_error: "Review rate must be a number",
    required_error: "Review rate is required"
  }).int().min(1).max(5),
  content: z.string({
    invalid_type_error: "Review content must be a string",
    required_error: "Review content is required"
  }).min(2).max(500)
})

export function validateReview(input) {
  return reviewSchema.safeParse(input)
}
