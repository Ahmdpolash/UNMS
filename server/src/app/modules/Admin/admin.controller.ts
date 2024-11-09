import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sentResponse";
import { StudentServices } from "./admin.services";

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllAdminsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Admins retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleAdminFromDb(id);

  res.status(200).json({
    success: true,
    message: "Single Admins retrieved successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.deleteAdminFromDb(id);

  res.status(200).json({
    success: true,
    message: " Admin deleted successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  const result = await StudentServices.updateAdminIntoDb(id, admin);
  res.status(200).json({
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
