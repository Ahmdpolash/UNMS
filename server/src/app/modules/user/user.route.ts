import { UserController } from "./user.controller";

import { studentValidations } from "../students/student.validation";
import validateRequest from "../../middleware/validateRequest";
import { NextFunction, Request, Response, Router } from "express";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createAdminValidationSchema } from "../Admin/admin.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constant";
import { UserValidation } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = Router();

router.post(
  "/create-student",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createValidationsSchema),
  UserController.createStudent
);

router.post(
  "/create-faculty",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty
);

router.post(
  "/create-admin",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin
);

router.post(
  "/change-status/:id",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus
);

router.get(
  "/me",
  auth(
    USER_ROLE.student,
    USER_ROLE.faculty,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  UserController.getMe
);

router.get("/", UserController.getAllUser);

export const UserRoute = router;
