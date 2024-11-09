import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { OfferedCourseValidations } from "./offeredCourse.validation";
import { OfferedCourseControllers } from "./offeredCourse.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  OfferedCourseControllers.getAllOfferedCourse
);

router.get(
  "/my-offered-courses",
  auth(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses
);

router.get(
  "/:id",
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  OfferedCourseControllers.getSingleOfferedCourse
);

router.post(
  "/create-offered-course",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse
);

router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse
);

router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferedCourseControllers.deleteOfferedCourse
);

export const offeredCourseRoutes = router;
