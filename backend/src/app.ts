import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import apiRouter from "./routes/v1/api/api";
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use("/v1/api", apiRouter);

// Define a simple route
app.get("/ping", (req, res) => {
  res.send("PONG developer 🚀!");
});
app.use(globalErrorHandler);

export default app;
