import express from 'express';
import ConsoleController from './console.controller.js';

const ConsoleRouter = express.Router();

// Define your routes here
ConsoleRouter.get('/', ConsoleController.getConsole);
ConsoleRouter.post('/', ConsoleController.insertConsole);
ConsoleRouter.put('/:id', ConsoleController.updateConsole);
ConsoleRouter.delete('/:id', ConsoleController.deleteConsole);

export default ConsoleRouter;