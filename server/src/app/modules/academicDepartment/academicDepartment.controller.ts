import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicDepartmentServices } from "./academicDepartment.services";
import sendResponse from "../../utils/sentResponse";

//create a new Department
const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDb(req.body);

  res.status(200).json({
    success: true,
    message: "Academic Department created successfully",
    data: result,
  });
});

//get all academic Department

const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentIntoDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Academic Department retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

//get single academic Department
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentIntoDb(
      departmentId
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Academic Department retrieved successfully",
    data: result,
  });
});

//update academic Department

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDb(
      departmentId,
      req.body
    );

  res.status(200).json({
    success: true,
    message: " Academic Department update successfully",
    data: result,
  });
});

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getSingleAcademicDepartment,
  getAllAcademicDepartment,
  updateAcademicDepartment,
};
