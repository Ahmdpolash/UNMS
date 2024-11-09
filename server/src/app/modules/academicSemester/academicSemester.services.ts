import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import {
  academicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from "./academicSemester.Constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.modal";
import QueryBuilder from "../../builder/QueryBuilder";

// create academicSemester
const createAcademicSemesterIntoDb = (payload: TAcademicSemester) => {
  // check if semester name and code not match
  // semester name --> semester code
  // academicSemesterNameCodeMapper['Fall'] == 03

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid semester name or code");
  }

  const result = AcademicSemester.create(payload);
  return result;
};

// get all semester
const getAllAcademicSemestersFromDb = async (
  query: Record<string, unknown>
) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get single academic semester
const getSingleAcademicSemesterFromDb = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  // const result = await AcademicSemester.aggregate([{ $match: { id } }]);

  return result;
};

//update semester

const updateAcademicSemesterFromDb = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid semester name or code");
  }

  const result = await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

//delete semester

const deleteAcademicSemesterFromDb = async (id: string) => {
  const result = await AcademicSemester.findByIdAndDelete(id);
  return result;
};

export const AcademicSemesterService = {
  createAcademicSemesterIntoDb,
  getAllAcademicSemestersFromDb,
  getSingleAcademicSemesterFromDb,
  deleteAcademicSemesterFromDb,
  updateAcademicSemesterFromDb,
};
