import { model, Schema } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from "./academicSemester.Constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: AcademicSemesterName,
    },
    code: {
      type: String,
      required: true,
      enum: AcademicSemesterCode,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      required: true,
      enum: Months,
    },
    endMonth: {
      type: String,
      required: true,
      enum: Months,
    },
  },
  {
    timestamps: true,
  }
);

// same year and same name not be applicable in same year
// thats why here we checking using pre hook if the name and the year is already exist then thorw a error message !!

academicSemesterSchema.pre("save", async function (next) {
  //not save the same year as same name of semester
  const isSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (isSemesterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Academic semester is already exist"
    );
  }

  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema
);
