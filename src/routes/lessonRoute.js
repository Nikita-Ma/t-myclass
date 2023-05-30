const express = require('express')
const router = express.Router()

// Import controllers
const getLesson = require("../controllers/lessonController");

router.route('/').get(getLesson)

module.exports = router
