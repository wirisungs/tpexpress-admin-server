//import
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const roleRoute = require("./src/routes/UserInfo/Role.route");
const employeeRoute = require("./src/routes/UserInfo/Employee.route");
const userRoute = require("./src/routes/UserInfo/User.route");
const orderRoute = require("./src/routes/OrderInfo/Order.route");
const driverRoute = require("./src/routes/DriverInfo/Driver.route");
const customerRoute = require("./src/routes/CustomerInfo/Customer.route");
const requestRoute = require("./src/routes/RequestInfo/Request.route");

//db connection
const db = require("./src/config/db.mongo.config");
db();

//port
const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("common"));

//routes
app.use("/api/role", roleRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/user", userRoute);
app.use("/api/order", orderRoute);
app.use("/api/driver", driverRoute);
app.use("/api/customer", customerRoute);
app.use("/api/request", requestRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
