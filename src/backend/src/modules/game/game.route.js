import express from 'express';
import GameController from './game.controller.js';

const GameRouter = express.Router();

// Define your routes here
GameRouter.get('/', GameController.getGame);
GameRouter.post('/', GameController.insertGame);
GameRouter.put('/:id', GameController.updateGame);
GameRouter.delete('/:id', GameController.deleteGame);

export default GameRouter;