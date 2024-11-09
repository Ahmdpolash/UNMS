import { Router } from "express";
import { AcademicDepartmentController } from "./academicDepartment.controller";
import validateRequest from "../../middleware/validateRequest";
import { AcademicDepartmentValidation } from "./academicDepartment.validation";

const router = Router();

router.post(
  "/create-academic-department",
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentController.createAcademicDepartment
);
router.get("/", AcademicDepartmentController.getAllAcademicDepartment);

router.get(
  "/:departmentId",
  AcademicDepartmentController.getSingleAcademicDepartment
);
router.patch(
  "/:departmentId",
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema
  ),
  AcademicDepartmentController.updateAcademicDepartment
);

export const AcademicDepartmentRoute = router;
