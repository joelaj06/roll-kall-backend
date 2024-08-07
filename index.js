const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./backend/config/conn.js");
const users = require("./backend/routes/users");
const { errorHandler } = require("./backend/middleware/error_middleware.js");
const attendance_dates = require("./backend/routes/attendance_dates");
const roles = require("./backend/routes/roles");
const teams = require("./backend/routes/teams");
const organization = require("./backend/routes/organization");
const activeUsersOfTheWeek = require("./backend/routes/active_users_of_the_week");
const averageChecksOfTheWeek = require("./backend/routes/average_checks_of_the_week");
const leaves = require("./backend/routes/leaves");
const leavesOfTheWeek = require("./backend/routes/leaves_of_the_week");
const dashboard = require("./backend/routes/dasboard.js");
const tasks = require("./backend/routes/tasks");
const reports = require("./backend/routes/reports");

const app = express();

connectToDatabase();

app.use(express.json());

//enable CORS for all routes
app.use(cors());

const port = process.env.PORT || 3000;

app.use("/api/users", users);
app.use("/api/attendance_dates", attendance_dates);
app.use("/api/roles", roles);
app.use("/api/teams", teams);
app.use("/api/organization", organization);
app.use("/api/activeUsersOfTheWeek", activeUsersOfTheWeek);
app.use("/api/averageChecksOfTheWeek", averageChecksOfTheWeek);
app.use("/api/leaves", leaves);
app.use("/api/leavesOfTheWeek", leavesOfTheWeek);
app.use("/api/dashboard", dashboard);
app.use("/api/tasks", tasks);
app.use("/api/reports", reports);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Sever started on port ${port}`);
  console.log(`http://localhost:${port}`);
});
