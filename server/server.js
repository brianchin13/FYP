const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const fs= require('fs-extra');
const mysql = require('mysql');
const path = require('path');


const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//cors access only to localhost:8080
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,user,origin,x-requested-with,x-api-key,accept,client-security-token');
    next();
});


//Listening to port
app.listen(port, () => {
    console.log(`Server listening on the port:${port}`);
});


//MSQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'SMS_FYP'

});


//Queries
app.get('/server/allUsers', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//select user from loginID
app.get('/server/user/:loginID', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM users WHERE user_id = ? ', [req.params.loginID], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});


//select user from role
app.get('/server/getUser/:role', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM users WHERE role =  ? ', [req.params.role], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});


//select student only
app.get('/server/getStudents', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM users WHERE role = "student" ', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//create user
app.post('/server/addUser', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);

        const params = req.body;
        connection.query('INSERT INTO users SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send('User added successfully');
                console.log('User added successfully')
            } else {
                console.log(err);
            }
        });
    });

});


//add lecturer to lecturer table
app.post('/server/addLecturer', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);

        const params = req.body;
        connection.query('INSERT INTO lecturers SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send('Lecturer added successfully');
                console.log('Lecturer added successfully')
            } else {
                console.log(err);
            }
        });
    });

});


//Remove user
app.delete('/server/removeUser/:user_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('DELETE FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(req.params.user_id + ' User deleted successfully');
                console.log(req.params.user_id + ' User deleted successfully')
            } else {
                console.log(err);
            }
        });
    });
});


//update user
app.put('/server/updateUser/:user_id', (req, res) => {

    const {full_name, email, phone_number} = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        // Update the user's name and email in the database
        connection.query('UPDATE users SET full_name = ?, email = ?, phone_number= ? WHERE user_id = ?', [full_name, email,phone_number, req.params.user_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(req.params.user_id + 'User updated successfully');
                console.log(req.params.user_id + ' User updated successfully');
            } else {
                console.log(err);
                res.status(500).send('Error updating user');
            }
        });
    });
});


//add faculty
app.post('/server/addFaculty', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);

        const params = req.body;
        connection.query('INSERT INTO faculty SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});

//get all faculty
app.get('/server/allFaculty', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM faculty', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});


//add programme
app.post('/server/addProgramme', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);

        const params = req.body;
        connection.query('INSERT INTO programme SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});
//

//get all programme
app.get('/server/allProgramme', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM programme', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//add subjects
app.post('/server/addSubjects', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        const params = req.body;
        connection.query('INSERT INTO subjects SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});

//get all subjects
app.get('/server/allSubjects', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM subjects', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//get programme by faculty name/ programme id
app.get('/server/getProgramme/:programmeDetails', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM programme WHERE faculty_name = ? OR programme_id = ?', [req.params.programmeDetails, req.params.programmeDetails], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//get subject by name or subject code
app.get('/server/getSubject/:subjectDetails', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM subjects WHERE subject_name = ? OR subject_code = ?', [req.params.subjectDetails, req.params.subjectDetails], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});


//Remove programme by programmeID
app.delete('/server/removeProgramme/:programme_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('DELETE FROM programme WHERE programme_id = ?', [req.params.programme_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(req.params.programme_id + ' Programme deleted successfully');
                console.log(req.params.programme_id + ' Programme deleted successfully')
            } else {
                console.log(err);
            }
        });
    });
});


//Remove subject by subjectCode
app.delete('/server/removeSubject/:subject_code', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('DELETE FROM subjects WHERE subject_code = ?', [req.params.subject_code], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(req.params.subject_code + ' Subject deleted successfully');
                console.log(req.params.subject_code + ' Subject deleted successfully')
            } else {
                console.log(err);
            }
        });
    });
});


//enrollment
app.post('/server/enrollment', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id' + connection.threadId);
        const params = req.body;
        connection.query('INSERT INTO enrollment SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});


//get all enrollment
app.get('/server/allEnrollment', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id' + connection.threadId);
        connection.query('SELECT * FROM enrollment', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});

//get enrollment by student id
app.get('/server/enrolledStudent/:student_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id' + connection.threadId);
        connection.query('SELECT * FROM enrollment WHERE student_id = ?', [req.params.student_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});


//get all subjects base on programmeID
app.get('/server/getSubjects/:programme_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM subjects WHERE programme_id = ? ', [req.params.programme_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});


//insert into subject_enrolled
app.post('/server/enrollSubjects', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id' + connection.threadId);
        const params = req.body;
        connection.query('INSERT INTO subject_enrolled SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});


//select all from subject_enrolled
app.get('/server/getEnrolledSubjects', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM subject_enrolled', (err, rows) => {
            connection.release();
            if (!err) {
                const subjectsArray = rows.map(row => {
                    const subjectDetails = JSON.parse(row.subjects); // Convert JSON string to object
                    return {
                        student_id: row.student_id,
                        programme_id: row.programme_id,
                        subjects: subjectDetails
                    };
                });
                res.send(subjectsArray); // Send array of objects with subjects data
            } else {
                console.log(err);
                res.status(500).send('Error fetching enrollment data');
            }
        });
    });
});

//select all from subject_enrolled by user_id
app.get('/server/getEnrolledSubjects/:student_id', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM subject_enrolled WHERE student_id = ?', [req.params.student_id], (err, rows) => {
            connection.release();
            if (!err) {
                const subjectsArray = rows.map(row => {
                    const subjectDetails = JSON.parse(row.subjects); // Convert JSON string to object
                    return {
                        student_id: row.student_id,
                        programme_id: row.programme_id,
                        subjects: subjectDetails
                    };
                });
                res.send(subjectsArray); // Send array of objects with subjects data
            } else {
                console.log(err);
            }
        });
    });
});

//select all from subject_enrolled
app.get('/server/getAllEnrolledSubjects', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM subject_enrolled', (err, rows) => {
            connection.release();
            if (!err) {
                const subjectsArray = rows.map(row => {
                    const subjectDetails = JSON.parse(row.subjects); // Convert JSON string to object
                    return {
                        student_id: row.student_id,
                        programme_id: row.programme_id,
                        subjects: subjectDetails
                    };
                });
                res.send(subjectsArray); // Send array of objects with subjects data
            } else {
                console.log(err);
            }
        });
    });
});


//drop student by id from enrollment and subjects
app.delete('/server/dropStudent/:student_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('DELETE FROM subject_enrolled WHERE student_id = ?', [req.params.student_id], (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }

            // Next, delete from enrollment table
            connection.query('DELETE FROM enrollment WHERE student_id = ?', [req.params.student_id], (err, rows) => {
                connection.release();
                if (!err) {
                    res.send(req.params.student_id + ' Student Drop successfully');
                    console.log(req.params.student_id + ' Student Drop successfully');
                } else {
                    console.log(err);
                }
            });
        });
    });
});


//create bills into payment
app.post('/server/createBill', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);

        const params = req.body;
        connection.query('INSERT INTO fees_payment SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send('Bill Generated Successfully');
                console.log('Bill Generated Successfully')
            } else {
                console.log(err);
            }
        });
    });
});

//get payment
app.get('/server/getStudentBills', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM fees_payment ', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//get payment by id
app.get('/server/getStudentBills/:student_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM fees_payment WHERE student_id = ? ', [req.params.student_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//update payment by id
app.put('/server/updatePayment/:payment_id', (req, res) => {

    const {payment_date, payment_type, bill_status} = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        // Update the user's name and email in the database
        connection.query('UPDATE fees_payment SET payment_date = ?, payment_type = ?, bill_status = ? WHERE payment_id = ?', [payment_date, payment_type, bill_status, req.params.payment_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(req.params.user_id + 'Payment successfully');
                console.log(req.params.user_id + ' Payment successfully');
            } else {
                console.log(err);
                res.status(500).send('Error make payment');
            }
        });
    });

});


//select * from lecturer table
app.get('/server/allLecturers', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM lecturers ', (err, rows) => {
            connection.release();
            if (!err) {
                const subjectsArray = rows.map(row => {
                    const subjectDetails = JSON.parse(row.subjects); // Convert JSON string to object
                    return {
                        lecturer_id: row.lecturer_id,
                        lecturer_name: row.lecturer_name,
                        lecturer_email: row.lecturer_email,
                        programme_id: row.programme_id,
                        programme_name: row.programme_name,
                        subjects: subjectDetails
                    };
                });
                res.send(subjectsArray); // Send array of objects with subjects data
            } else {
                console.log(err);
            }
        });
    });
});

//select lecturer from lecturer table by id
app.get('/server/getLecturer/:lecturer_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM lecturers WHERE lecturer_id = ?', [req.params.lecturer_id], (err, rows) => {
            connection.release();
            if (!err) {
                const subjectsArray = rows.map(row => {
                    const subjectDetails = JSON.parse(row.subjects); // Convert JSON string to object
                    return {
                        lecturer_id: row.lecturer_id,
                        lecturer_name: row.lecturer_name,
                        lecturer_email: row.lecturer_email,
                        faculty_name:row.faculty_name,
                        programme_id: row.programme_id,
                        programme_name: row.programme_name,
                        subjects: subjectDetails
                    };
                });
                res.send(subjectsArray); // Send array of objects with subjects data
            } else {
                console.log(err);
            }
        });
    });
});


//update user
app.put('/server/updateLecturer/:user_id', (req, res) => {

    const {full_name, email, programme_id, programme_name,subjects} = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        // Update the user's name and email in the database
        connection.query('UPDATE lecturers SET lecturer_name = ?, lecturer_email = ?, programme_id = ?, programme_name = ?,subjects = ? WHERE lecturer_id = ?', [full_name, email, programme_id, programme_name, subjects,req.params.user_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(req.params.user_id + 'Lecturer updated successfully');
                console.log(req.params.user_id + ' Lecturer updated successfully');
            } else {
                console.log(err);
                res.status(500).send('Error updating user');
            }
        });
    });
});


//create class
app.post('/server/addClass', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);

        const params = req.body;
        connection.query('INSERT INTO classes SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send('Class Created');
                console.log('Class Created')
            } else {
                console.log(err);
            }
        });
    });
});

//select * from class
app.get('/server/allClasses', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM classes ', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//select * from class by id
app.get('/server/getClasses/:programme_id', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM classes WHERE programme_id = ?', [req.params.programme_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//insert into attendance
app.post('/server/submitAttendance', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id' + connection.threadId);
        const params = req.body;
        connection.query('INSERT INTO attendance SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});

//select all from attendance
app.get('/server/getAttendance', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM attendance', (err, rows) => {
            connection.release();
            if (!err) {
                const attendancesArray = rows.map(row => {
                    const attendance = JSON.parse(row.attendance); // Convert JSON string to object
                    return {
                        class_id: row.class_id,
                        attendance: attendance,
                        total_attended: row.total_attended,
                        total_students: row.total_students,
                    };
                });
                res.send(attendancesArray); // Send array of objects with subjects data
            } else {
                console.log(err);
            }
        });
    });
});


//insert into mail
app.post('/server/create-mail', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id' + connection.threadId);
        const params = req.body;
        connection.query('INSERT INTO mail SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
                console.log(rows)
            } else {
                console.log(err);
            }
        });
    });
});

//select * from mail by id
app.get('/server/getMail/:receiver_id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM mail WHERE receiver_id = ? ',[req.params.receiver_id], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
});

//create assessment
app.post('/server/createAssessment', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as id ' + connection.threadId);

        const params = req.body;
        connection.query('INSERT INTO assessment SET ?', params, (err, rows) => {
            connection.release();
            if (!err) {
                res.send('Assessment Created');
                console.log('Assessment Created')
            } else {
                console.log(err);
            }
        });
    });
});

//select all from assessment
app.get('/server/getAssessment', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM assessment', (err, rows) => {
            connection.release();
            if (!err) {
                const assessmentArray = rows.map(row => {
                    // const mark = JSON.parse(row.marks); // Convert JSON string to object
                    return {
                        assessment_id: row.assessment_id,
                        subject_id: row.subject_id,
                        assessment_deadline: row.assessment_deadline,
                        marks: row.marks,
                    };
                });
                res.send(assessmentArray); // Send array of objects with subjects data
            } else {
                console.log(err);
            }
        });
    });
});



//read from excel file
const upload = multer({dest: "./temp/uploads/"});
app.post("/server/read", upload.single("marks"), (req, res) => {

    try{
        if (req.file?.filename == null || req.file?.filename == "undefined") {
            res.status(400).send('No file uploaded.');
        }else{
            var filePath = './temp/uploads/'+req.file.filename;

            const excelData = excelToJson({
                sourceFile: filePath,
                header:{
                    rows: 1
                },
                columnToKey: {
                    "*": "{{columnHeader}}",
                },
            });

            res.status(200).json(excelData);
        }

    }catch (err){
        res.status(500).send(err);
    }
});


// //storage engine
// const storage = multer.diskStorage({
//     destination:'./temp/uploads/',
//     filename: (req, file, cb)=>{
//         return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// });
//
//
// const upload2 = multer({storage:storage});
//
// app.post("/server/uploader", upload2.single("marks"), (req, res) => {
//    console.log(req.file)
// });
// Configure multer to handle file uploads
// const storage = multer.memoryStorage(); // Store the file in memory
// const upload = multer({ storage: storage });

// // API endpoint to handle file upload and save it to the database
// app.post("/server/uploader", upload.single("marks"), (req, res) => {
//     pool.getConnection((err, connection) => {
//         if (err) throw err;
//         console.log('connected as id ' + connection.threadId);
//
//         const params = req.body;
//         connection.query('INSERT INTO assessment SET ?', params, (err, rows) => {
//             connection.release();
//             if (!err) {
//                 res.send('Assessment Created');
//                 console.log('Assessment Created')
//             } else {
//                 console.log(err);
//             }
//         });
//     });
//
// });


