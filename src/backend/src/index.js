import express from "express";
import UserRouter from "./modules/user/user.route.js";

const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// config routes
app.use("/user", UserRouter);

// gracefully shutdown
process.on("SIGINT", () => {
    console.log("Shutting down server");
    process.exit(0);
});