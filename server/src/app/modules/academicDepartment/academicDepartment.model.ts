import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../errors/AppError";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AcademicFaculty",
    },
  },
  {
    timestamps: true,
  }
);

// academicDepartmentSchema.pre("save", async function (next) {
//   const isExistAcademicDepartment = await AcademicDepartment.findOne({
//     name: this.name,
//   });

//   if (isExistAcademicDepartment) {
//     throw new AppError(404, "Academic department name already exist");
//   }

//   next();
// });

academicDepartmentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  const isExistAcademicDepartment = await AcademicDepartment.findOne(query);

  if (!isExistAcademicDepartment) {
    throw new AppError(404, "This department doesn't exist");
  }

  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema
);
