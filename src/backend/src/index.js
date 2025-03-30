import express from "express";
import UserRouter from "./modules/user/user.route.js";
import GameRouter from "./modules/game/game.route.js";
import ConsoleRouter from "./modules/console/console.route.js";
const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// config routes
app.use("/user", UserRouter);
app.use("/game", GameRouter);
app.use("/console", ConsoleRouter);
// gracefully shutdown
process.on("SIGINT", () => {
    console.log("Shutting down server");
    process.exit(0);
});