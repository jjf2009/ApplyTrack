require('dotenv').config();
const app=require("./app");
const {connectDB,disconnectDB} = require('./config/db');

const Port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        console.log("Server closed");

        try {
          await disconnectDB();
          console.log("Database disconnected");
          process.exit(0);
        } catch (err) {
          console.error("Error during DB disconnect:", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};




start();