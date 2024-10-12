//import
const express = require('express');
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config();


//db connection
const db = require('./src/config/db.mongo.config');
db();

//port
const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());

//routes
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
