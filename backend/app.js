const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errormiddelwear = require("./middelwear/error");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");

// const cookieParser = require("cookie-parser");

const product = require("./router/productroute");
const user = require("./router/userroutes");
const order = require("./router/orderrout");

const option = {
  definition: {
    openapi: "3.0.0",
    info: "Node Js Api",
    servers: [
      {
        url: "http://localhost:5000/api/v1/",
      },
    ],
  },
  apis: ["./router/productroute.js"],
};
const swaggerSpc = swaggerJsDoc(option);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpc));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());

// Routes Import
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

// Middelwear for error
app.use(errormiddelwear);

module.exports = app;
