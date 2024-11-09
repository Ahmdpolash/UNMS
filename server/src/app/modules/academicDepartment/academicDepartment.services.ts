import QueryBuilder from "../../builder/QueryBuilder";
import { AcademicDepartmentSearchableFields } from "./academicDepartment.constant";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

//create academic department
const createAcademicDepartmentIntoDb = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);

  return result;
};

//get all departments
const getAllAcademicDepartmentIntoDb = async (
  query: Record<string, unknown>
) => {
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartment.find().populate("academicFaculty"),
    query
  )
    .search(AcademicDepartmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await academicDepartmentQuery.modelQuery;
  const meta = await academicDepartmentQuery.countTotal();

  return {
    meta,
    result,
  };
};

//get single department
const getSingleAcademicDepartmentIntoDb = async (id: string) => {
  const result = await AcademicDepartment.findById(id).populate(
    "academicFaculty"
  );
  return result;
};

//update department
const updateAcademicDepartmentIntoDb = async (
  id: string,
  payload: TAcademicDepartment
) => {
  const result = await AcademicDepartment.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};
export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDb,
  getAllAcademicDepartmentIntoDb,
  getSingleAcademicDepartmentIntoDb,
  updateAcademicDepartmentIntoDb,
};
