import express from "express";
import UserController from "./user.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const UserRouter = express.Router();

// Define your routes here
UserRouter.get("/", authMiddleware, UserController.getUser);
UserRouter.post("/", authMiddleware, UserController.insertUser);
UserRouter.put("/:id", authMiddleware, userAuthorization, UserController.updateUser);
UserRouter.delete("/:id", authMiddleware, userAuthorization, UserController.deleteUser);

export default UserRouter;
