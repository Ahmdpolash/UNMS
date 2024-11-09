import { Router } from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../../middleware/validateRequest";
import { studentValidations } from "./student.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.getAllStudent
);

router.get(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  StudentController.getSingleStudent
);

router.patch(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),

  validateRequest(studentValidations.updateValidationsSchema),
  StudentController.updateStudent
);

router.delete(
  "/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentController.deleteStudent
);

export const StudentRoute = router;
