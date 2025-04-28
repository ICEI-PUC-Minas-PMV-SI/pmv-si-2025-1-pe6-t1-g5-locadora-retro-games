import express from 'express';
import DashboardController from './dashboard.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import isAdmin from '../../middleware/isAdminAuthorization.middleware.js';

const DashboardRouter = express.Router();

DashboardRouter.get('/summary', authMiddleware, isAdmin, DashboardController.getSummary);

export default DashboardRouter;
