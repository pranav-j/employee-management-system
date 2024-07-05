const mongoose = require('mongoose');
require('dotenv').config();

// const dbURI='mongodb+srv://pranavjdeveloper:3TTGBsSp2AffwMpj@employees.hwkjstb.mongodb.net/?retryWrites=true&w=majority&appName=EMPLOYEES';

const dbURI = process.env.dbURI;

mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connected...............');
    })
    .catch(err => console.error('MongoDB connection or index setup error:', err));

