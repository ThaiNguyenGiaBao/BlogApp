const express = require('express');
const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

mongoose.connect(process.env.DATABASE_URL, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB')
});


app.listen(3001,()=> {
    console.log('Server is running on port 3001')
})