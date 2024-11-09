import mongoose from "mongoose";
import config from "../../config";
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { AcademicSemester } from "../academicSemester/academicSemester.modal";
import { TStudent } from "../students/student.interface";
import { Student } from "../students/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import {
  generatedAdminId,
  generatedFacultyId,
  generateStudentId,
} from "./user.utils";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TFaculty } from "../faculty/faculty.interface";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Faculty } from "../faculty/faculty.model";
import { TAdmin } from "../Admin/admin.interface";
import { Admin } from "../Admin/admin.model";
import { verifyToken } from "../Auth/auth.utils";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

//create new student (user)
const CreateStudentIntoDb = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  //user object
  const userData: Partial<TUser> = {};

  //if password is not given, then use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = "student";

  //set student email
  userData.email = payload.email;

  //find admission semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester
  );

  if (!admissionSemester) {
    throw new AppError(400, "Admission semester not found");
  }

  // find department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new AppError(400, "Aademic department not found");
  }
  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // set generated id
    userData.id = await generateStudentId(admissionSemester!);

    //send image to cloudinary

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImage = secure_url as string;
    }

    //create a user (transaction - 1)
    const newUser = await User.create([userData], { session }); //array

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    //create a student

    //set id ,_id as student
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // referencing id

    //create a student (transaction - 2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

//create new faculty (user)

const CreateFacultyIntoDb = async (
  file: any,
  password: string,
  payload: TFaculty
) => {
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = "faculty";
  //set faculty email
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment
  );

  if (!academicDepartment) {
    throw new AppError(400, "Academic department not found");
  }

  payload.academicFaculty = academicDepartment?.academicFaculty;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // set generated id
    userData.id = await generatedFacultyId();

    //send image to cloudinary
    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImage = secure_url as string;
    }
    //create a new user (faculty)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    //set id ,_id as faculty

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // referencing id

    //create a new user (faculty) transaction - 2

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty");
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

//create new admin (user)

const CreateAdminIntoDb = async (
  file: any,
  password: string,
  payload: TAdmin
) => {
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set admin role role
  userData.role = "admin";
  //set admin email
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generatedAdminId();

    //send image to cloudinary
    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      const { secure_url } = await sendImageToCloudinary(imageName, path);

      payload.profileImage = secure_url as string;
    }

    // create a user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // referencing id

    //create admin

    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getAllUsersFromDb = async () => {
  const result = await User.find();
  return result;
};

// get me

const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === "student") {
    result = await Student.findOne({ id: userId }).populate("user");
  }

  if (role === "admin") {
    result = await Admin.findOne({ id: userId }).populate("user");
  }

  if (role === "faculty") {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }

  return result;
};

//change user status
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

export const UserService = {
  CreateStudentIntoDb,
  CreateFacultyIntoDb,
  getAllUsersFromDb,
  CreateAdminIntoDb,
  getMe,
  changeStatus,
};
