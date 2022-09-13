const express = require('express');
const {connectToDatabase} = require('./backend/config/conn.js');
const users = require('./backend/routes/users');
const {errorHandler }= require('./backend/middleware/error_middleware.js');
const attendance_dates = require('./backend/routes/attendance_dates');
const roles = require('./backend/routes/roles');
const teams = require('./backend/routes/teams')
const app = express();

connectToDatabase();


app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/api/users', users);
app.use('/api/attendance_dates', attendance_dates);
app.use('/api/roles',roles);
app.use('/api/teams',teams);

app.use(errorHandler);

app.listen(port, () =>{
    console.log(`Sever started on port ${port}`);
    console.log(`http://localhost:${port}`);
})




