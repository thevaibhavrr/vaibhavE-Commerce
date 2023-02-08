const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabse = require("./config/database");

require("dotenv").config();
// require("dotenv").config({ path: "./config/config.env" });
// handleing uncaught Exception

process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`sutting down the server due to uncaughtException`);
  process.exit(1);
});

dotenv.config({ path: "./config/config.env" });
// connecting databse
connectDatabse();
// console.log(process.env.PORT);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is runnning on  http://localhost:${process.env.PORT}`);
});

// unhandels promis

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`sutting down the server due to unhandele proimis rejection`);
  server.close(() => {
    process.exit(1);
  });
});
