import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/change-password",
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  "/forget-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.resetPassword
);

export const AuthRoutes = router;