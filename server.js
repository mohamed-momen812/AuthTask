const mongoose = require("mongoose");
const app = require("./app");

require("dotenv").config();

// Handel UncaughtException (console.log(Undefined variable)) (Reference Errors)
process.on("uncaughtException", (error) => {
  console.error("uncaught Exception  Shuting down...");
  process.exit(1);
});

// Handel unhandledRejection
process.on("unhandledRejection", (err) => {
  console.error("Unhandeled Rejection  Shuting down...");
  server.close(() => {
    process.exit(1);
  });
});

if (!process.env.DATABASE_PASSWORD) {
  logger.error("DATABASE_PASSWORD environment variable is not defined");
  process.exit(1);
}

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

let server;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection successful");

    const port = process.env.PORT || 5000;
    server = app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Error connecting to database: ${error.message}`);
    process.exit(1);
  });
