
function configObject(teachersData, studentsData) {

    console.log('==========teachersData============')
    console.log(teachersData)
    console.log('===============END===============')
    console.log('============STUDENTS DATA============')
    console.log(studentsData)
    console.log('===============END===============')
    let tempArray = []
    for (let i = 0; i !== teachersData.length; i++) {
        console.log('===============LOGIC===============')
        let filtData = studentsData.filter((objectStudent) => objectStudent.lesson_id === teachersData[i].lesson_id)

        if (tempArray.find(tempObject => tempObject.id === teachersData[i].lesson_id)) {

            let selectedObject = tempArray.findIndex((tempObject) => tempObject.id === filtData[0].lesson_id)
            tempArray[selectedObject].teachers = [tempArray[selectedObject].teachers, {
                id: teachersData[i].teacher_id,
                name: teachersData[i].name
            }]
        } else {

            const arrSelectedStudents = []
            for (let countStudents = 0; filtData.length !== arrSelectedStudents.length; countStudents++) {
                arrSelectedStudents.push({
                    id: filtData[countStudents].student_id,
                    name: filtData[countStudents].name,
                    visit: filtData[countStudents].visit,
                })
            }


            tempArray.push({
                id: teachersData[i].lesson_id,
                date: teachersData[i].date,
                title: teachersData[i].title,
                status: teachersData[i].status,
                visitCount: 0,
                students: arrSelectedStudents,
                teachers: {
                    id: teachersData[i].teacher_id,
                    name: teachersData[i].name
                },
            })
        }
    }

    // TODO: Write in SQL
    for (let i = 0; i !== tempArray.length; i++) {
        let realVisitCount = tempArray[i].students.filter(studentsObject => studentsObject.visit === true)
        tempArray[i].visitCount = realVisitCount.length
    }

    return tempArray
}


module.exports = configObject