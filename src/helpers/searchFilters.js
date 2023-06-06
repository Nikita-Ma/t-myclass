const db = require('../config/db')


//TODO: rewrite sql query on CASE

const searchFilterDate = async (date, status, teacherIds, studentsCount, smartPage, smartLessonPerPage) => {

    // @data req.query only date
    if (date !== undefined &&
        status === undefined &&
        teacherIds === undefined &&
        studentsCount === undefined &&
        smartPage !== undefined &&
        smartLessonPerPage !== undefined) {
        console.log('\x1b[34m', '@data req.query only date' + '\x1b[0m')


        if (date.split(',').length === 2) {
            const teachersData = await db.query(
                '  SELECT *\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 ' +
                '  ORDER BY lesson_id\n'
                ,
                [date.split(',')[0], date.split(',')[1]]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT *\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.lesson_id = students.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2' +
                '  ORDER BY lesson_id\n'
                ,
                [date.split(',')[0], date.split(',')[1]]
            )

            return [teachersData.rows, studentsData.rows]
        }


        if (date.split(',').length === 1) {
            const teachersData = await db.query(
                '  SELECT lesson_id, teacher_id,  date, title, status, name\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date = $1 ' +
                '  ORDER BY lesson_id\n'
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
            return [teachersData.rows, studentsData.rows]
        }
    }



    // @data req.query only date && status
    if (date !== undefined &&
        status !== undefined &&
        teacherIds === undefined &&
        studentsCount === undefined &&
        smartPage !== undefined &&
        smartLessonPerPage !== undefined) {
        console.log('\x1b[34m', '@@data req.query only date && status' + '\x1b[0m')


        if (date.split(',').length === 2) {
            const teachersData = await db.query(
                '  SELECT *\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3' +
                '  ORDER BY lesson_id\n'

                ,
                [date.split(',')[0], date.split(',')[1], status]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT *\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.lesson_id = students.id\n' +
                '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3' +
                '  ORDER BY lesson_id\n'
                ,
                [date.split(',')[0], date.split(',')[1], status]
            )

            return [teachersData.rows, studentsData.rows]
        }


        if (date.split(',').length === 1) {
            const teachersData = await db.query(
                '  SELECT lesson_id, teacher_id,  date, title, status, name\n' +
                '  FROM lesson_teachers\n' +
                '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
                '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
                '  WHERE lessons.date = $1 AND status=$2' +
                '  ORDER BY lesson_id\n'
                ,
                [date.split(',')[0], status]
            )

            const studentsData = await db.query(
                '\n' +
                '  SELECT  lesson_id, student_id, visit, date, status, name\n' +
                '  FROM lesson_students\n' +
                '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
                '  INNER JOIN students ON lesson_students.student_id = students.id\n' +
                '  WHERE lessons.date = $1 AND status=$2' +
                '  ORDER BY lesson_id\n'
                ,
                [date.split(',')[0], status]
            )

            return [teachersData.rows, studentsData.rows]

        }
    }

    // @data req.query only date && status && teacherIds

    if (date.split(',').length === 2) {
        const teachersData = await db.query(
            '  SELECT *\n' +
            '  FROM lesson_teachers\n' +
            '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
            '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
            '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3 AND teacher_id = $4' +
            '  ORDER BY lesson_id\n'
            ,
            [date.split(',')[0], date.split(',')[1], status, teacherIds]
        )

        const studentsData = await db.query(
            '\n' +
            '  SELECT *\n' +
            '  FROM lesson_students\n' +
            '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
            '  INNER JOIN students ON lesson_students.lesson_id = students.id\n' +
            '  WHERE lessons.date BETWEEN $1 AND $2 AND status = $3' +
            '  ORDER BY lesson_id\n'
            ,
            [date.split(',')[0], date.split(',')[1], status]
        )

        return [teachersData.rows, studentsData.rows]

    }


    if (date.split(',').length === 1) {
        const teachersData = await db.query(
            '  SELECT lesson_id, teacher_id,  date, title, status, name\n' +
            '  FROM lesson_teachers\n' +
            '  INNER JOIN lessons ON lesson_teachers.lesson_id = lessons.id\n' +
            '  INNER JOIN teachers ON lesson_teachers.teacher_id = teachers.id\n' +
            '  WHERE lessons.date = $1 AND status=$2 AND teacher_id = $3' +
            '  ORDER BY lesson_id\n'
            ,
            [date.split(',')[0], status, teacherIds]
        )

        const studentsData = await db.query(
            '\n' +
            '  SELECT  lesson_id, student_id, visit, date, status, name\n' +
            '  FROM lesson_students\n' +
            '  INNER JOIN lessons ON lesson_students.lesson_id = lessons.id\n' +
            '  INNER JOIN students ON lesson_students.student_id = students.id\n' +
            '  WHERE lessons.date = $1 AND status=$2' +
            '  ORDER BY lesson_id\n'
            ,
            [date.split(',')[0], status]
        )
        return [teachersData.rows, studentsData.rows]
    }

}

module.exports = searchFilterDate