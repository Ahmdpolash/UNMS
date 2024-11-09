import { Router } from "express";
import { AcademicFacultyController } from "./academicFaculty.controller";
import validateRequest from "../../middleware/validateRequest";
import { AcademicFacultyValidation } from "./academicFaculty.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
  "/create-academic-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),

  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema
  ),
  AcademicFacultyController.createAcademicFaculty
);
router.get("/", AcademicFacultyController.getAllAcademicFaculty);
router.get("/:id", AcademicFacultyController.getSingleAcademicFaculty);
router.patch(
  "/:id",
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema
  ),
  AcademicFacultyController.updateAcademicFaculty
);

export const AcademicFacultyRoute = router;
