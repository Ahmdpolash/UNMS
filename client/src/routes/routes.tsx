import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";

import Register from "../pages/Register";
import adminPaths from "./Admin.routes";
import { routerGenerator } from "../utils/routesGenerator";
import { facultyPaths } from "./faculty.routes";
import { studentPaths } from "./student.routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    
  },

  //for admin dashboard
  {
    path: "/admin",
    element: <App />,
    children: routerGenerator(adminPaths),
  },

  //for faculty dashboard
  {
    path: "/faculty",
    element: <App />,
    children: routerGenerator(facultyPaths),
  },
  //for admin student
  {
    path: "/student",
    element: <App />,
    children: routerGenerator(studentPaths),
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
