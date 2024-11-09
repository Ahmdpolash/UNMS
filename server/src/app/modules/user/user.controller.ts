import { UserService } from "./user.services";

import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createStudent = catchAsync(async (req, res) => {
  const { password, student: StudentData } = req.body;

  // const validate =
  //   studentValidations.createStudentValidationSchema.parse(StudentData);

  const result = await UserService.CreateStudentIntoDb(
    req.file,
    password,
    StudentData
  );

  console.log(result);

  res.status(200).json({
    success: true,
    message: "student created successfully",
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: FacultyData } = req.body;

  const result = await UserService.CreateFacultyIntoDb(
    req.file,
    password,
    FacultyData
  );
  res.status(200).json({
    success: true,
    message: "faculty created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: AdminData } = req.body;

  const result = await UserService.CreateAdminIntoDb(
    req.file,
    password,
    AdminData
  );
  res.status(200).json({
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

//? get all user
const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDb();

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

// ? get me
const getMe = catchAsync(async (req, res) => {
  // const token = req.headers.authorization;

  // if (!token) {
  //   throw new AppError(httpStatus.NOT_FOUND, "Token not found !");
  // }

  const { userId, role } = req.user;

  const result = await UserService.getMe(userId, role);

  res.status(200).json({
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

//? change status
const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserService.changeStatus(id, req.body);
  console.log(result);
  res.status(200).json({
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
  getAllUser,
  createAdmin,
  getMe,
  changeStatus,
};
