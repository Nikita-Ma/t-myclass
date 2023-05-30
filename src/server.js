require('dotenv').config()
const express = require('express')
const app = express()

// routes
const lessonRoute = require('./routes/lessonRoute')

// utils
const connectDB = require("./utils/connectDB");

// connect DB
connectDB()
app.use('/', lessonRoute)


// start server
const PORT = process.env.PORT || 3005

app.listen(PORT, () => {
    console.log('\x1b[32m' + `[SERVER] Started on ${PORT}` + '\x1b[0m')
})