import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { AuthServices } from "./auth.services";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production", // set to true if using HTTPS
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1yr
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);

  res.status(200).json({
    success: true,
    message: "password is updated successfully",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;

  const result = await AuthServices.forgetPassword(userId);

  res.status(200).json({
    success: true,
    message: "Reset token is genereted successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved succesfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset succesful!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
