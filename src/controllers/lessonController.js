// * @desc Get lesson data && All params optional
// * @route GET /?date=YYY-MD-DD | YYY-MD-DD,YYY-MD-DD &
//               status=0|1 &
//               teacherIds=teacherId, teacherId &
//               studentsCount=dateNumber | dataNumberStart, dataNumberEnd &
//               lessonPerPage=defFiveLesson
// * @access Public
const getLesson = (req, res) => {

    return res.statusCode(400)
}

module.exports = getLesson
