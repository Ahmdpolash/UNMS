import { Router } from "express";
import { CourseController } from "./course.controller";
import validateRequest from "../../middleware/validateRequest";
import { CourseValidations } from "./course.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
  "/create-course",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseController.createCourse
);

router.get(
  "/",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty
  ),
  CourseController.getAllCourse
);

router.get(
  "/:id",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty
  ),
  CourseController.getSingleCourse
);

router.delete("/:id", auth("admin"), CourseController.deleteCourse);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseController.updateCourseIntoDb
);

router.put(
  "/:courseId/assign-faculties",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.assignFacultiesWithCourse
);
router.get(
  "/:courseId/get-faculties",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty
  ),
  CourseController.getFacultiesWithCourse
);

router.delete(
  "/:courseId/remove-faculties",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseController.removeFacultiesFromCourse
);

export const CourseRoutes = router;
