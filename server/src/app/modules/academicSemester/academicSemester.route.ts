import { Router } from "express";
import { AcademicSemesterController } from "./academicSemester.controller";
import validateRequest from "../../middleware/validateRequest";
import { AcademicSemesterValidation } from "./academicSemester.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/create-academic-semester",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(AcademicSemesterValidation.createAcademicSemesterValidation),
  AcademicSemesterController.createAcademicSemester
);

router.get(
  "/",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  AcademicSemesterController.getAllAcademicSemesters
);

router.get(
  "/:semesterId",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  AcademicSemesterController.getSingleAcademicSemester
);
router.patch(
  "/:semesterId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(AcademicSemesterValidation.updateAcademicSemesterValidation),
  AcademicSemesterController.updateAcademicSemester
);

export const AcademicSemesterRoute = router;
