import { z } from "zod";

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: "Academic Department name must be string" }),

    academicFaculty: z.string({
      invalid_type_error: "Academic Department must be a string",
      required_error: "Academic is required",
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Academic Department name must be string" })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: "Academic Department must be a string",
        required_error: "Department is required",
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
