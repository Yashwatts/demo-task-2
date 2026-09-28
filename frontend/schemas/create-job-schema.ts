import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),
  department: z
    .string()
    .min(3, "Department must be at least 3 characters long")
    .max(50, "Department must be at most 50 characters long"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(100, "Location must be at most 100 characters long"),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"], {
    message:
      "Employment type must be one of 'full-time', 'part-time', 'contract', or 'internship'",
  }),
  minExperience: z
    .number()
    .min(0, "Minimum experience must be at least 0 years")
    .max(50, "Minimum experience must be at most 50 years"),
  requiredSkills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required"),
  applicationDeadline: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Application deadline must be a valid date",
    ),
});

export type CreateJobSchema = z.infer<typeof createJobSchema>;
