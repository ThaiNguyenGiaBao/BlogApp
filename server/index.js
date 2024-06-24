const express = require('express');
const { default: mongoose } = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Use this after the variable declaration

mongoose.connect(process.env.DATABASE_URL, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB')
});


app.use('/', authRoute);

app.listen(3001,()=> {
    console.log('Server is running on port 3001')
})