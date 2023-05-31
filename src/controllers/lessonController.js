const db = require('../config/db')
const configObject = require("../helpers/configObject");


// * @desc Get lesson data && All params optional
// * @route GET /?date=YYY-MD-DD | YYY-MD-DD,YYY-MD-DD &
//               status=0|1 &
//               teacherIds=teacherId, teacherId &
//               studentsCount=dateNumber | dataNumberStart, dataNumberEnd &
//               page=defFirstsPage
//               lessonPerPage=defFiveLesson
// * @access Public
const getLesson = async (req, res) => {
    const {date, status, teacherIds, studentsCount, page, lessonPerPage} = req.query
    console.log('REQ QUERY', date, status, teacherIds, studentsCount, page, lessonPerPage)


    // @data req.query only date && status && teacherIds
    if (date !== undefined &&
        status !== undefined &&
        teacherIds !== undefined &&
        studentsCount === undefined &&
        page === undefined &&
        lessonPerPage === undefined) {


        if (date.split(',').length === 2) {

            const teachersData = await db.query(
                '  SELECT *\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lesson_teachers.lesson_id = $1',
                [teacherIds]
            )

        }

        if (date.split(',').length === 1) {

            const teachersData = await db.query(
                '  SELECT *\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lesson_teachers.teacher_id = $1',
                [teacherIds]
            )
            console.log(teachersData.rows)

        }
    }


    // @data req.query only date && status
    if (date !== undefined &&
        status !== undefined &&
        teacherIds === undefined &&
        studentsCount === undefined &&
        page === undefined &&
        lessonPerPage === undefined) {


        if (date.split(',').length === 2) {
            const dat = await db.query(
                'SELECT * FROM lessons WHERE date BETWEEN $1 AND $2 AND status=$3',
                [date.split(',')[0], date.split(',')[1], status]
            )

        }

        if (date.split(',').length === 1) {
            const dat = await db.query(
                'SELECT * FROM lessons WHERE date = $1 AND status=$2',
                [date.split(',')[0], status]
            )
            console.log(dat.rows)

        }
    }

    // @data req.query only date
    if (date !== undefined &&
        status === undefined &&
        teacherIds === undefined &&
        studentsCount === undefined &&
        page === undefined &&
        lessonPerPage === undefined) {
        console.log('@data req.query only date')


        if (date.split(',').length === 2) {
            const teachersData = await db.query(
                '  SELECT *\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 '
                ,
                [date.split(',')[0], date.split(',')[1]]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT *\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.lesson_id = students.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2'
                ,
                [date.split(',')[0], date.split(',')[1]]
            )

            const readyData = configObject(teachersData.rows, studentsData.rows)
            console.log(readyData)
        }


        if (date.split(',').length === 1) {
            const teachersData  = await db.query(
                '  SELECT lesson_id, teacher_id,  date, title, status, name\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date = $1 '
                ,
                [date.split(',')[0]]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT  lesson_id, student_id, visit, date, status, name\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.student_id = students.id\n' +
                '  WHERE lessons.date = $1'
                ,
                [date.split(',')[0]]
            )

            const readyData = configObject(teachersData.rows, studentsData.rows)
            console.log('============================')
            return res.send(readyData)
        }

    }

    return res.status(400).send('Bad request..')
}

module.exports = getLesson
