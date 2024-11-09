import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

import { SemesterRegistrationService } from "./semesterRegistration.services";
import sendResponse from "../../utils/sentResponse";

// create new semester
const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.createSemesterRegistrationIntoDB(
      req.body
    );

  res.status(200).json({
    success: true,
    message: "Semester registration created successfully",
    data: result,
  });
});

// get all semesters
const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationService.getAllSemesterRegistrationsFromDB(
      req.query
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Semester registrations retrived successfully",
    meta: result.meta,
    data: result.result,
  });
});

// get single registered semester by id  (using id from url parameter)
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result =
    await SemesterRegistrationService.getSingleSemesterRegistrationsFromDB(id);

  res.status(200).json({
    success: true,
    message: "Single semester registration retrieved successfully",
    data: result,
  });
});

// update registered semester
const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result =
    await SemesterRegistrationService.updateSemesterRegistrationIntoDB(
      id,
      req.body
    );

  res.status(200).json({
    success: true,
    message: "Semester registration updated successfully",
    data: result,
  });
});

// delete registered semester
const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationService.deleteSemesterRegistrationFromDB(id);
  res.status(200).json({
    success: true,
    message: "Semester registration deleted successfully",
    data: result,
  });
});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
