import httpStatus from "http-status";
import { AcademicSemester } from "../academicSemester/academicSemester.modal";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import { SemesterRegistration } from "./semesterRegistration.model";
import AppError from "../../errors/AppError";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";
import mongoose from "mongoose";
import { OfferedCourse } from "../OfferedCourse/offeredCourse.model";

// register a new semester
const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
  /**
   * Step1: Check if there any registered semester that is already 'UPCOMING'|'ONGOING'
   * Step2: Check if the semester is exist
   * Step3: Check if the semester is already registered!
   * Step4: Create the semester registration
   */

  const academicSemester = payload?.academicSemester;

  //check if there any registered semester that is already 'UPCOMING'|'ONGOING'

  const isThereAnyUpcomingOrOngoingSEmester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSEmester) {
    throw new AppError(
      httpStatus.CONFLICT,
      `There is aready an ${isThereAnyUpcomingOrOngoingSEmester.status} registered semester !`
    );
  }

  // check if the semester is already exist
  const isAcademicSemesterExists = await AcademicSemester.findById(
    academicSemester
  );

  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic semester not found");
  }

  // check if the semester is already registered!
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This semester is already registered"
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

//get all registered semester
const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = await new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  const meta = await semesterRegistrationQuery.countTotal();
  return { meta, result };
};

//get single semester registration
const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  return result;
};

// update semester registration
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  /**
   * Step1: Check if the semester is exist
   * Step2: Check if the requested registered semester is exists
   * Step3: If the requested semester registration is ended, we will not update anything
   * Step4: If the requested semester registration is 'UPCOMING', we will let update everything.
   * Step5: If the requested semester registration is 'ONGOING', we will not update anything  except status to 'ENDED'
   * Step6: If the requested semester registration is 'ENDED' , we will not update anything
   *
   * UPCOMING --> ONGOING --> ENDED
   *
   */

  // Check if the requested registered semester is exists

  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "This semester is not found !");
  }

  // If the requested semester registration is ended, we will not update anything

  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedStatus = payload?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This semester is already ${currentSemesterStatus}`
    );
  }

  // UPCOMING --> ONGOING --> ENDED

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus == RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus == RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// delete semester registration
const deleteSemesterRegistrationFromDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registraton when the status is 
  'UPCOMING'.
  **/

  // check the semester registration is exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, "This semester is not found!");
  }

  // checking if the status is still "UPCOMING"
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;

  if (semesterRegistrationStatus !== "UPCOMING") {
    throw new AppError(
      httpStatus.CONFLICT,
      `This semester is not ${semesterRegistrationStatus}. You can only delete it when the status is ${RegistrationStatus.UPCOMING}`
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //tr-1
    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        session,
      }
    );

    if (!deletedOfferedCourse) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to delete offered course"
      );
    }

    //tr-2

    const deletedSemisterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        session,
        new: true,
      });

    if (!deletedSemisterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to delete semester registration !"
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedSemisterRegistration;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
