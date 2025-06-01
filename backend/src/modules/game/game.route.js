import express from 'express';
import GameController from './game.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import isAdmin from '../../middleware/isAdminAuthorization.middleware.js';

const GameRouter = express.Router();

// Define your routes here
GameRouter.get('/', authMiddleware, GameController.getGame);
GameRouter.post('/', authMiddleware, isAdmin, GameController.insertGame);
GameRouter.put('/:id', authMiddleware, isAdmin, GameController.updateGame);
GameRouter.delete('/:id', authMiddleware, isAdmin, GameController.deleteGame);

export default GameRouter;