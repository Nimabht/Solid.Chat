import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Define a simple route
app.get("/ping", (req, res) => {
  res.send("PONG developer 🚀!");
});
app.use(globalErrorHandler);

export default app;
