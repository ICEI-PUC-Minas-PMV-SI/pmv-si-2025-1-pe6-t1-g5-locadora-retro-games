import express from "express";
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './config/swagger-output.json' with { type: "json" };
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import AuthRouter from "./modules/auth/auth.route.js";
import UserRouter from "./modules/user/user.route.js";
import GameRouter from "./modules/game/game.route.js";
import ConsoleRouter from "./modules/console/console.route.js";
import OrderRouter from "./modules/order/order.route.js";

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const corsOptions = {
  origin: ['http://localhost:3000']
}
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// config routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/games", GameRouter);
app.use("/consoles", ConsoleRouter);
app.use("/orders", OrderRouter)

// gracefully shutdown
process.on("SIGINT", () => {
    console.log("Shutting down server");
    process.exit(0);
});