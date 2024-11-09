import mongoose from "mongoose";
import { TErrors, TGenericErrorResponse } from "../interface/error";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSources: TErrors = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;
