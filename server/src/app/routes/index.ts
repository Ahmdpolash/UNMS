import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { StudentRoute } from "../modules/students/student.route";
import { AcademicSemesterRoute } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoute } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoute } from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { CourseRoutes } from "../modules/Course/course.route";
import { SemesterRegistrationRoutes } from "../modules/SemesterRegistration/semesterRegistration.route";
import { offeredCourseRoutes } from "../modules/OfferedCourse/offeredCourse.route";
import {  AuthRoutes } from "../modules/Auth/auth.route";
import { EnrolledCourseRoutes } from "../modules/EnrolledCourse/enrolledCourse.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoute,
  },
  {
    path: "/students",
    route: StudentRoute,
  },
  {
    path: "/faculties",
    route: FacultyRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/academic-semesters",
    route: AcademicSemesterRoute,
  },
  {
    path: "/academic-faculties",
    route: AcademicFacultyRoute,
  },
  {
    path: "/academic-departments",
    route: AcademicDepartmentRoute,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  {
    path: "/semester-registrations",
    route: SemesterRegistrationRoutes,
  },
  {
    path: "/offered-courses",
    route: offeredCourseRoutes,
  },
  {
    path: "/enrolled-courses",
    route: EnrolledCourseRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

// router.use("/users", UserRoute);
// router.use("/students", StudentRoute);

export default router;
