import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCoursefaculty } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

//create
const createCourseIntoDb = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

//get all courses
const getAllCoursesFromDb = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate("preRequisiteCourses.course"),
    query
  )
    .search(CourseSearchableFields)
    .sort()
    .paginate()
    .fields()
    .filter();

  const meta = await courseQuery.countTotal();
  const result = await courseQuery.modelQuery;
  return { meta, result };
};

//get single course by id
const getSingleCoursesFromDb = async (id: string) => {
  const result = await Course.findById(id).populate(
    "preRequisiteCourses.course"
  );
  return result;
};

// delete single course
const deleteCourseFromDb = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

//update course

const updateCourseIntoDb = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //step1: basic course info update (title,code,prefix,credits)

    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
    }

    // check if there is any pre requisite courses to update

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
      }

      // filter out the new course fields

      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted
      );

      const addNewPrerequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!addNewPrerequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course!");
      }
    }

    //end transaction
    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      "preRequisiteCourses.course"
    );

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
  }
};

//assign faculty
const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCoursefaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: {
        faculties: { $each: payload },
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return result;
};

//get faculties with courses
const getFacultyWithCoursesFromDb = async (courseId: string) => {
  const result = await CourseFaculty.findOne({ course: courseId }).populate(
    "faculties"
  );

  return result;
};

//delete faculty

const removeFacultiesFromCourseFromDb = async (
  id: string,
  payload: Partial<TCoursefaculty>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    }
  );

  return result;
};

export const CourseServices = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getSingleCoursesFromDb,
  deleteCourseFromDb,
  updateCourseIntoDb,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDb,
  getFacultyWithCoursesFromDb,
};
