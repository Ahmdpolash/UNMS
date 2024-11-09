import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { EnrolledCourseServices } from "./enrolledCourse.services";
import sendResponse from "../../utils/sentResponse";

const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Enrolled Course successfully",
    data: result,
  });
});

const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My enrolled course retrived successfully",
    meta: result.meta,
    data: result.result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    userId,
    req.body
  );
  res.status(200).json({
    success: true,
    message: "Mark is updated successfully",
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourses,
};
