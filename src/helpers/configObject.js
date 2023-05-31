// TODO: *  bug if student > teachers
//       *  bug if students other lessons
//


function configObject(teachersData, studentsData) {

    // create response object
    let prepareData = []
    studentsData.filter((studentObj) => {
        for (let idx = 0; idx < teachersData.length; idx++) {
            if (studentObj.lesson_id === teachersData[idx].lesson_id) {
                prepareData.push({
                    id: teachersData[idx].lesson_id,
                    date: teachersData[idx].date,
                    title: teachersData[idx].title,
                    status: teachersData[idx].status,
                    visitCount: studentObj.visit,
                    students: [
                        {
                            id: studentObj.student_id,
                            name: studentObj.name,
                            visit: studentObj.visit,
                        }
                    ],
                    teachers: [
                        {
                            id: teachersData[idx].teacher_id,
                            name: teachersData[idx].name,
                        }
                    ]
                })
            }
        }
    })


    let counter = 0
    let allCounter = 0
    let modifyData = []
    // update visitCount function
    prepareData.map((itemObject) => {

        allCounter++
        if (itemObject.students.map(item => item.visit)[0] === true) {
            counter++
        }

        if (allCounter === prepareData.length) {
            for (const el of prepareData) {
                el.visitCount = counter
                modifyData.push(el)
            }
        }
    })


    return modifyData
}

module.exports = configObject