import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import { User } from "../user/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken, verifyToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  //   const isUserExists = await User.findOne({ id: payload?.id });  // this is also how we check it

  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user not found");
  }

  //checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked !!");
  }

  //checking if the password is correct
  // const isPasswordMatch = await bcrypt.compare(
  //   payload?.password,
  //   isUserExists?.password
  // );

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "password do not matched");
  }

  //create token and sent to the server

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_epires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

//! change password

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //? hashed new password

  // const newHashedPassword = await bcrypt.hashSync(payload.newPassword, 12);
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

//! forgot password
const forgetPassword = async (userId: string) => {
  // checking if the user is exist

  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetUiLink = `${config.reset_pass_ui_link}?id=${user?.id}&token=${resetToken}`;

  sendEmail(user?.email, resetUiLink);
};

//!reset password
const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: any
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  //verify token
  const decoded = verifyToken(token, config.jwt_access_secret as string);

  if (payload.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
  }

  // hashed new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  //update it on db
  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
};

//! refresh token

const refreshToken = async (token: string) => {
  //check if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
