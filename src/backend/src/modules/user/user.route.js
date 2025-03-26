import express from 'express';
import UserController from './user.controller.js';

const UserRouter = express.Router();

// Define your routes here
UserRouter.get('/', UserController.getUser);
UserRouter.post('/', UserController.insertUser);

export default UserRouter;