import { startSession } from "mongoose";

import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { Faculty } from "./faculty.model";
import { TFaculty } from "./faculty.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { FacultySearchableFields } from "./faculty.constant";

const getAllFacultiesFromDb = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate("academicDepartment academicFaculty"),
    query
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  const meta = await facultyQuery.countTotal();
  return {
    result,
    meta,
  };
};

//single
const getSingleFacultyFromDb = async (id: string) => {
  // const result = await Faculty.findById(id);
  const result = await Faculty.findById(id).populate("academicDepartment");

  return result;
};

//update
const updateFacultyIntoDb = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;

  const modifiedData: Record<string, unknown> = { ...remainingFacultyData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

//delete

const deleteFacultyFromDb = async (id: string) => {
  const session = await startSession();

  try {
    session.startTransaction();
    //delete faculty (transaction - one )
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Faculty");
    }

    // get user _id from deletedFaculty
    const userId = deletedFaculty.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to delete faculty");
  }
};

export const FacultyServices = {
  getAllFacultiesFromDb,
  getSingleFacultyFromDb,
  updateFacultyIntoDb,
  deleteFacultyFromDb,
};
