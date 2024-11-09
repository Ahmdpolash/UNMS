import mongoose from "mongoose";
import { TAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { AdminSearchableFields } from "./admin.constant";

const getAllAdminsFromDb = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
  const meta = await adminQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getSingleAdminFromDb = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const deleteAdminFromDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete Admin");
    }

    //transactin two
    // get user _id from deletedAdmin
    const userId = deletedAdmin.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete User");
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to delete Admin");
  }
};

const updateAdminIntoDb = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedData: Record<string, unknown> = { ...remainingAdminData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const StudentServices = {
  getAllAdminsFromDb,
  getSingleAdminFromDb,
  updateAdminIntoDb,
  deleteAdminFromDb,
};
