const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./dbConnection');
const routes = require('./routes');
const path = require('path');
const dotenv = require('dotenv');
require('dotenv').config();

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

const corsOptions = {
    origin:"http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
}

app.use(express.json());
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

app.use('/api', routes);
 
// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../frontend/build'))); 

// // This route should serve the React app
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;