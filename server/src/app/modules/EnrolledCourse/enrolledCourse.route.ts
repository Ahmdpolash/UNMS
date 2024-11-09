import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { EnrolledCourseValidations } from "./enrolledCourse.validation";
import { EnrolledCourseControllers } from "./enrolledCourse.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/create-enrolled-course",
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema
  ),
  EnrolledCourseControllers.createEnrolledCourse
);

router.get(
  "/my-enrolled-courses",
  auth(USER_ROLE.student),
  EnrolledCourseControllers.getMyEnrolledCourses
);

router.patch(
  "/update-enrolled-course-marks",
  auth(USER_ROLE.faculty, USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks
);

export const EnrolledCourseRoutes = router;
