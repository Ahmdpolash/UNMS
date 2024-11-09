import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoute } from "./app/modules/user/user.route";
import { StudentRoute } from "./app/modules/students/student.route";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();



//parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

//routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("University Managment Services - 2.0 , Backend Server ..!");
});

//middleware
app.use(globalErrorHandler);
app.use(notFound);

export default app;
