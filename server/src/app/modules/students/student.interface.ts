import { Model, Types } from "mongoose";

export type TUserName = {
  firstName: string;
  middleName: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

// student interface
export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TUserName;
  gender: "male" | "female";
  dateOfBirth: Date;
  contactNo: string;
  emerGencyContactNumber: string;
  email: string;
  bloogGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  presentAddress?: string;
  permenentAddress?: string;
  guardian: TGuardian;
  localGuardian?: TLocalGuardian;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
  profileImage?: string;
};

export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}
