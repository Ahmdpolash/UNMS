import { model, Schema } from "mongoose";
import {
  TCourse,
  TCoursefaculty,
  TPreRequisiteCourses,
} from "./course.interface";

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const CourseSchema = new Schema<TCourse>({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  prefix: {
    type: String,
    required: true,
    trim: true,
  },

  code: {
    type: Number,
    required: true,
  },

  credits: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },

  preRequisiteCourses: [preRequisiteCoursesSchema],
});

export const Course = model<TCourse>("Course", CourseSchema);

// course faculty model

const courseFacultySchema = new Schema<TCoursefaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
    },
  ],
});

export const CourseFaculty = model<TCoursefaculty>(
  "CourseFaculty",
  courseFacultySchema
);
