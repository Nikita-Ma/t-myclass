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


    // @data req.query only date && status && teacherIds && studentsCount
    if (date !== undefined &&
        status !== undefined &&
        teacherIds !== undefined &&
        studentsCount !== undefined &&
        page === undefined &&
        lessonPerPage === undefined) {

        console.log('\x1b[34m', '@data req.query only date && status && teacherIds && studentsCount' + '\x1b[0m')

        console.log(date.split(',').length === 2 && studentsCount.split(',').length === 2)
        if (date.split(',').length === 2 && studentsCount.split(',').length === 2) {
            const teachersData = await db.query(
                '  SELECT *\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3 AND teacher_id = $4'
                ,
                [date.split(',')[0], date.split(',')[1], status, teacherIds]
            )
            const studentsData = await db.query(
                'SELECT *\n' +
                'FROM (\n' +
                '  SELECT *\n' +
                '  FROM (\n' +
                '    SELECT lesson_id, date, COUNT(*) AS row_count\n' +
                '    FROM (\n' +
                '      SELECT lesson_id, student_id, visit, date, status, name\n' +
                '      FROM lesson_students\n' +
                '      INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '      INNER JOIN students ON lesson_students.student_id = students.id\n' +
                '      WHERE lessons.date BETWEEN $1 AND $2 AND status = $3\n' +
                '    ) subquery\n' +
                '    GROUP BY lesson_id, date\n' +
                '  ) row_count_subquery\n' +
                '  JOIN lesson_students ON row_count_subquery.lesson_id = lesson_students.lesson_id\n' +
                '  JOIN students  on lesson_students.student_id = students.id\n' +
                '  WHERE row_count BETWEEN $4 AND $5\n' +
                ') select_all_students;\n'
                ,
                [date.split(',')[0], date.split(',')[1], status, studentsCount.split(',')[0], studentsCount.split(',')[1]]
            )

            const readyData = configObject(teachersData.rows, studentsData.rows)
            console.log(studentsData.rows)
        }


        if (date.split(',').length === 1 && studentsCount.split(',').length === 1) {
            const teachersData = await db.query(
                '  SELECT lesson_id, teacher_id,  date, title, status, name\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date = $1 AND status=$2 AND teacher_id = $3'
                ,
                [date.split(',')[0], status, teacherIds]
            )

            const studentsData = await db.query(
                'SELECT *\n' +
                'FROM (\n' +
                '  SELECT *\n' +
                '  FROM (\n' +
                '    SELECT lesson_id, date, COUNT(*) AS row_count\n' +
                '    FROM (\n' +
                '      SELECT lesson_id, student_id, visit, date, status, name\n' +
                '      FROM lesson_students\n' +
                '      INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '      INNER JOIN students ON lesson_students.student_id = students.id\n' +
                '      WHERE lessons.date = $1 AND status = $2' +
                '    ) subquery\n' +
                '    GROUP BY lesson_id, date\n' +
                '  ) row_count_subquery\n' +
                '  JOIN lesson_students ON row_count_subquery.lesson_id = lesson_students.lesson_id\n' +
                '  JOIN students  on lesson_students.student_id = students.id\n' +
                '  WHERE row_count = $3' +
                ') select_all_students;\n'
                ,
                [date.split(',')[0], status, studentsCount]
            )

            // TODO: Rewrite on sql (EXPAND SQL QUERY)
            console.log(studentsData.rows)


            const readyData = configObject(teachersData.rows, studentsData.rows)
            console.log('============================')
            return res.send(readyData)
        }

    }


    // @data req.query only date && status && teacherIds
    if (date !== undefined &&
        status !== undefined &&
        teacherIds !== undefined &&
        studentsCount === undefined &&
        page === undefined &&
        lessonPerPage === undefined) {

        console.log('\x1b[34m', '@data req.query only date && status && teacherIds' + '\x1b[0m')


        if (date.split(',').length === 2) {
            const teachersData = await db.query(
                '  SELECT *\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3 AND teacher_id = $4'
                ,
                [date.split(',')[0], date.split(',')[1], status, teacherIds]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT *\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.lesson_id = students.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3'
                ,
                [date.split(',')[0], date.split(',')[1], status]
            )

            const readyData = configObject(teachersData.rows, studentsData.rows)
            console.log(readyData)
        }


        if (date.split(',').length === 1) {
            const teachersData = await db.query(
                '  SELECT lesson_id, teacher_id,  date, title, status, name\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date = $1 AND status=$2 AND teacher_id = $3'
                ,
                [date.split(',')[0], status, teacherIds]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT  lesson_id, student_id, visit, date, status, name\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.student_id = students.id\n' +
                '  WHERE lessons.date = $1 AND status=$2'
                ,
                [date.split(',')[0], status]
            )
            console.log(teachersData.rows, studentsData.rows)
            const readyData = configObject(teachersData.rows, studentsData.rows)
            console.log('============================')
            return res.send(readyData)
        }

    }


    // @data req.query only date && status
    if (date !== undefined &&
        status !== undefined &&
        teacherIds === undefined &&
        studentsCount === undefined &&
        page === undefined &&
        lessonPerPage === undefined) {

        console.log('\x1b[34m', '@data req.query only date && status' + '\x1b[0m')


        if (date.split(',').length === 2) {
            const teachersData = await db.query(
                '  SELECT *\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3'
                ,
                [date.split(',')[0], date.split(',')[1], status]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT *\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.lesson_id = students.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3'
                ,
                [date.split(',')[0], date.split(',')[1], status]
            )

            const readyData = configObject(teachersData.rows, studentsData.rows)
            console.log(readyData)
        }


        if (date.split(',').length === 1) {
            const teachersData = await db.query(
                '  SELECT lesson_id, teacher_id,  date, title, status, name\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date = $1 AND status=$2'
                ,
                [date.split(',')[0], status]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT  lesson_id, student_id, visit, date, status, name\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.student_id = students.id\n' +
                '  WHERE lessons.date = $1 AND status=$2'
                ,
                [date.split(',')[0], status]
            )

            const readyData = configObject(teachersData.rows, studentsData.rows)
            console.log('============================')
            return res.send(readyData)
        }

    }

    // @data req.query only date
    if (date !== undefined &&
        status === undefined &&
        teacherIds === undefined &&
        studentsCount === undefined &&
        page === undefined &&
        lessonPerPage === undefined) {
        console.log('\x1b[34m', '@data req.query only date' + '\x1b[0m')


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
            const teachersData = await db.query(
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
