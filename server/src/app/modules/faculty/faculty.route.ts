import { Router } from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../../middleware/validateRequest";
import { updateFacultyValidationSchema } from "./faculty.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculties
);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  FacultyControllers.getSingleFaculty
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.deleteFaculty
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty
);

export const FacultyRoutes = router;
