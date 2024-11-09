import { z } from "zod";

const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: "Academic Faculty name must be string" }),
  }),
});

const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Academic Faculty name must be string" })
      .optional(),
  }),
});

export const AcademicFacultyValidation = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
