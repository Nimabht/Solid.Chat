import dotenv from "dotenv";

// Determine the environment and load the appropriate .env file
const envFile =
  process.env.NODE_ENV === "production"
    ? "./config/prod.env"
    : "./config/dev.env";

dotenv.config({ path: envFile });

import app from "./app";
import connectDB from "./db/connection";
import initOwner from "./utils/helpers/initOwner";

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and then start the server
connectDB()
  .then(async () => {
    await initOwner();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
