const dotenv = require('dotenv').config({path:'../config/.env'});
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const {uri} = require('./db.js')


const connectToDatabase = async () => {
    console.log(process.env.ATLAS_URI)
    try{
        const conn = await mongoose.connect(process.env.ATLAS_URI || uri, {useNewUrlParser : true});
        console.log(`Connected to Database ${conn.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit();
    }
}


module.exports = {connectToDatabase}

// const MongoClient = mongodb.MongoClient;
// const client = new MongoClient(process.env.ATLAS_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// let dbConnection;

// module.exports = {
//     connectToDatabase: function (){
//         client.connect(function (err, dbClient){
//             if(err || !dbClient) {
//                 console.log('Failed to connect to Database');
//                 console.log(err);
//             }else{
//                 dbConnection = dbClient.db('roll_kall');
//                 console.log(`Connected to Database ${dbConnection.databaseName} `);

//             }
//         });
//     },

//     getDb: function () {
//         return dbConnection;
//     }
// }