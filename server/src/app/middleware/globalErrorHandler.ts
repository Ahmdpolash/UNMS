import { ErrorRequestHandler } from "express";

import { ZodError, ZodIssue } from "zod";
import { TErrors } from "../interface/error";
import config from "../config";
import { handleZodError } from "../errors/handleZodError";
import { handleValidationError } from "../errors/hanldeValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "something went wrong";

  let errorSources: TErrors = [
    {
      path: "",
      message: "something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simpliFiedError = handleZodError(err);

    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorSources = simpliFiedError?.errorSources;
  } else if (err.name === "ValidationError") {
    const simpliFiedError = handleValidationError(err);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorSources = simpliFiedError?.errorSources;
  } else if (err.name === "CastError") {
    const simpliFiedError = handleCastError(err);

    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorSources = simpliFiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });

  next();
};

export default globalErrorHandler;

/* 

pattens 

success
message
errorSources:[
  path:'',
  message:''
]
stack


*/
