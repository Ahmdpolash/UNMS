import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { SemesterRegistrationValidations } from "./semesterRegistration.validation";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
  "/create-semester-registration",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.createSemesterRegistration
);

router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  SemesterRegistrationController.getSingleSemesterRegistration
);

router.patch(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.updateSemesterRegistration
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SemesterRegistrationController.deleteSemesterRegistration
);

router.get(
  "/",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  SemesterRegistrationController.getAllSemesterRegistrations
);

export const SemesterRegistrationRoutes = router;
