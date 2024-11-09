import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.services";
import sendResponse from "../../utils/sentResponse";

// create offered courses
const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Offered course created successfully",
    data: result,
  });
});

//get all offered courses
const getAllOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCourseFromDB(
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offered course retrived successfully",
    meta: result.meta,
    data: result.result,
  });
});

//get my offered courses
const getMyOfferedCourses = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    userId,
    req.query
  );

  res.status(200).json({
    success: true,
    message: "my offered course retrived successfully",
    data: result,
  });
});

// get single offered course
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);

  res.status(200).json({
    success: true,
    message: "Sigle Offered course retrived successfully",
    data: result,
  });
});

// update
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Offered course updated successfully",
    data: result,
  });
});

//delete
const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);

  res.status(200).json({
    success: true,
    message: "Offered course deleted successfully",
    data: result,
  });
});
export const OfferedCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
  getSingleOfferedCourse,
  getAllOfferedCourse,
  deleteOfferedCourse,
  getMyOfferedCourses,
};
