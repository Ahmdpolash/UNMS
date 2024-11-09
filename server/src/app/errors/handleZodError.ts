import { ZodError, ZodIssue } from "zod";
import { TErrors, TGenericErrorResponse } from "../interface/error";

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrors = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = 400;

  return {
    statusCode,
    message: " validation error",
    errorSources,
  };
};
