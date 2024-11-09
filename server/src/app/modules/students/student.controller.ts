import { RequestHandler } from "express";
import { StudentService } from "./student.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import httpStatus from "http-status";

//get all students
const getAllStudent = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudent(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "student retrived successfully",
    meta: result.meta,
    data: result.result,
  });
});

//get single student
const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.getSingleStudent(id);
  res.status(200).json({
    success: true,
    message: "single student retrived successfully",
    data: result,
  });
});

// delete student
const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentService.deleteStudentFromDb(id);
  res.status(200).json({
    success: true,
    message: "student deleted successfully",
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;

  const result = await StudentService.updateStudentIntoDB(id, student);

  res.status(200).json({
    success: true,
    message: "student updated successfully",
    data: result,
  });
});

export const StudentController = {
  getAllStudent,
  deleteStudent,
  getSingleStudent,
  updateStudent,
};
