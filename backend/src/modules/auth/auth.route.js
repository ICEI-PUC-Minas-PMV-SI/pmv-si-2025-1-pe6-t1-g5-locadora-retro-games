import express from 'express';
import AuthController from './auth.controller.js';

const UserRouter = express.Router();

// Define your routes here
UserRouter.post('/', AuthController.login);

export default UserRouter;