const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Initializations
const app = express();
const port = 4000;

// Database
const mongoURL = "mongodb://admin-cesar:admin123456@34.125.125.78:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const db = mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    //useFindAndModify: false,
    ///useCreateIndex: true,
    useUnifiedTopology: true
}).then(db => console.log("DB is connected")).catch(err => console.error(err));

// Settings

// Middlewares 

app.use(morgan('dev'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next();
});

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}));
app.use(express.json());

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
require('./routes/api/app/manager')(app);

// Server is listening
app.listen(port, () => {
    console.log(`Server on port ${port}`);
});