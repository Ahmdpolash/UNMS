import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { AcademicFacultyServices } from "./academicFaculty.services";

//create a new faculty
const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDb(
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Academic Faculty created successfully",
    data: result,
  });
});

//get all academic faculty

const getAllAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesIntoDb(
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Academic Faculty retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

//get single academic faculty
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await AcademicFacultyServices.getSingleAcademicFacultyIntoDb(
    facultyId
  );

  res.status(200).json({
    success: true,
    message: "Single Academic Faculty retrieved successfully",
    data: result,
  });
});

//update academic faculty

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDb(
    facultyId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: " Academic Faculty update successfully",
    data: result,
  });
});

export const AcademicFacultyController = {
  createAcademicFaculty,
  getSingleAcademicFaculty,
  getAllAcademicFaculty,
  updateAcademicFaculty,
};
