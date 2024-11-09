import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

// const notFound = async (req: Request, res: Response, next: NextFunction) => {

//   return res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: "API Not Found !!",
//     status: httpStatus.NOT_FOUND,
//   });

//   next();
// };

const notFound = async (req: Request, res: Response, next: NextFunction) => {
  // Check if the headers have already been sent
  if (!res.headersSent) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "API Not Found !!",
      status: httpStatus.NOT_FOUND,
    });
  } else {
    // If headers are already sent, pass to the next middleware
    next();
  }
};

export default notFound;
