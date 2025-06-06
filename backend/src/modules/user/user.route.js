import express from "express";
import UserController from "./user.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import userAuthorization from '../../middleware/userAuthorization.middleware.js'
import isAdmin from "../../middleware/isAdminAuthorization.middleware.js";

const UserRouter = express.Router();

// Define your routes here
UserRouter.get("/", authMiddleware, isAdmin, UserController.getUser);
UserRouter.get("/userAdmin", authMiddleware, isAdmin, UserController.getUserById);
UserRouter.get("/user", authMiddleware, userAuthorization, UserController.getUserById);
UserRouter.post("/", authMiddleware, UserController.insertUser);
UserRouter.put("/:id", authMiddleware, userAuthorization, UserController.updateUser);
UserRouter.delete("/:id", authMiddleware, userAuthorization, UserController.deleteUser);

export default UserRouter;
