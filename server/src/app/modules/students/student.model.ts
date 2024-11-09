import { Schema, model } from "mongoose";
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from "./student.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// User Name Schema
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is not a valid',
    // },
  },
});

// Guardian Schema
const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, "Father Name is required"],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, "Father occupation is required"],
  },
  fatherContactNo: {
    type: String,
    required: [true, "Father Contact No is required"],
  },
  motherName: {
    type: String,
    required: [true, "Mother Name is required"],
  },
  motherOccupation: {
    type: String,
    required: [true, "Mother occupation is required"],
  },
  motherContactNo: {
    type: String,
    required: [true, "Mother Contact No is required"],
  },
});

// Local Guardians Schema
const localGuardiansSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  occupation: {
    type: String,
    required: [true, "Occupation is required"],
  },
  contactNo: {
    type: String,
    required: [true, "Contact number is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
});

// Student Schema
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, "ID is required"],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User id is required"],
      unique: true,
      ref: "Users",
    },
    name: {
      type: userNameSchema,
      required: [true, "Name is required"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "{VALUE} is not a valid gender",
      },
      required: [true, "Gender is required"],
    },
    dateOfBirth: {
      type: Date,
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: '{VALUE} is not a valid',
      // },
    },
    emerGencyContactNumber: {
      type: String,
      required: [true, "Emergency contact number is required"],
    },
    bloogGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "{VALUE} is not a valid blood status",
      },
    },
    presentAddress: {
      type: String,
      required: [true, "Present address is required"],
    },
    permenentAddress: {
      type: String,
      required: [true, "Permanent address is required"],
    },
    guardian: {
      type: guardianSchema,
      // required: [false, "Guardians information is required"],
      required: false,
    },
    localGuardian: {
      type: localGuardiansSchema,
      required: [false, "Local guardians information is required"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: "AcademicFaculty",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

//virtual
studentSchema.virtual("fullName").get(function () {
  return this?.name?.firstName + this?.name?.middleName + this?.name?.lastName;
});

studentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();

  const isStudentExist = await Student.findOne(query);
  console.log(isStudentExist);

  if (!isStudentExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Student does not exist");
  }

  next();
});

//creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// Query Middleware
// studentSchema.pre("find", function (next) {
//   this.find({ isDeleted: { $ne: false } }); // Changed $ne: true to $ne: false
//   next;
// });
// studentSchema.pre("findOne", function (next) {
//   this.find({ isDeleted: { $ne: true } });
//   next();
// });

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
