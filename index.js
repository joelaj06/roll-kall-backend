const express = require('express');
const {connectToDatabase} = require('./backend/config/conn.js');
const users = require('./backend/routes/users');
const {errorHandler }= require('./backend/middleware/error_middleware.js')


const app = express();

connectToDatabase();


app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/api/users', users);

app.use(errorHandler);

app.listen(port, () =>{
    console.log(`Sever started on port ${port}`);
    console.log(`http://localhost:${port}`);
})




