var express = require('express');
var router = express.Router();
// var mysql = require('mysql');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const fileUpload = require('express-fileupload');
// var createError = require('http-errors');
const con = require("../DBConfig.js");

// router.use(express.static(path.join(__dirname, 'build')));
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// router.set('views', path.join(__dirname, 'views'));
// router.set('view engine', 'jade');

// const bodyParser = require('body-parser');
// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(bodyParser.json());
// var cors = require('cors');
// router.use(cors());
// router.use(express.json());
// router.use(express.urlencoded({ extended: false }));
// router.use(cookieParser());
// router.use(fileUpload());
// router.use(logger('dev'));
// router.use(express.static(path.join(__dirname, 'public')));
// router.use('/', indexRouter);
// router.use('/users', usersRouter);


router.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send('login failed');
    } else {
        var sql = "SELECT * FROM User where Username = ? AND UserPassword = ?";
        con.query(sql, [req.body.username, req.body.password], function (err, result) {
            console.log(result.length);
            if (result.length > 0) {
                // this.user = req.body.username;
                // req.session.user = req.body.username;
                // req.session.admin = true;
                // console.log(req.session + " " + req.session.user + " " + req.session.admin);
                let obj = {
                    msg: "Successful",
                    result: result,
                }
                res.send(obj);
            } else {
                let obj = {
                    msg: "Failed!",
                }
                res.send(obj);
            }
        })
    }
});

router.post('/saveQuiz', function (req, res) {

    let flashcardPackID = req.body.flashcardPackID;

    if (flashcardPackID === '') {
        flashcardPackID = -1;
    }

    let sql = `INSERT INTO Quiz (NumberOfQuestions, QuestionsComleted, rightAnswers, QUserID, QFlashcardPackID) VALUES (${req.body.numberOfQuestions}, ${req.body.questionCount}, ${req.body.rightAnswerCount}, ${req.body.userID}, ${flashcardPackID})`;

    console.log(req.body.numberOfQuestions, req.body.questionCount, req.body.rightAnswerCount, req.body.userID)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('One record inserted');
        // let obj = {
        //     msg: "Successful!",
        //     result: result,
        // }
        // res.send(result);
        // console.log(req.body.question.FlashcardImage.data);
        let sql = `INSERT INTO Question (Question, QuestionChoice1, QuestionChoice2, QuestionChoice3, QuestionChoice4, Answer, QuizID) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        con.query(sql, [req.body.question.FlashcardID, req.body.answerArray[0], req.body.answerArray[1], req.body.answerArray[2], req.body.answerArray[3], req.body.rightAnswer, result.insertId], function (err, result) {
            if (err) throw err;
            console.log('One record inserted');
            // let obj = {
            //     msg: "Successful!",
            //     result: result,
            // }
            res.send(result);
        });
    });

});

router.post('/deleteQuiz', function (req, res) {

    let sql = `DELETE FROM QUIZ WHERE QuizID = ${req.body.quizID};`;

    con.query(sql, function (err, result) {
        if (err) throw err;

        res.send(result);
    });

});

router.post('/questions', function (req, res) {
    var sql = "SELECT * FROM Question where QuizID = ?";
    con.query(sql, [req.body.quizID], function (err, result) {
        console.log(result.length);
        res.send(result);
    });
});

router.post('/register', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send('login failed');
    } else {
        var sql = "SELECT * FROM User where Username = ?";
        con.query(sql, [req.body.username], function (err, result) {
            console.log(result.length);
            if (result.length > 0) {
                let obj = {
                    msg: "Failed",
                }
                res.send(obj);
            } else {

                let sql = `INSERT INTO User (Username, UserPassword) VALUES ("${req.body.username}", "${req.body.password}")`;

                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log('One record inserted');

                    let obj = {
                        msg: "Successful!",
                        result: result,
                    }
                    res.send(obj);
                });


            }
        })
    }
});

router.post('/registerFacebook', function (req, res) {

    if (!req.body.username) {
        res.send('login failed');
    } else {
        var sql = "SELECT * FROM User where Username = ?";
        con.query(sql, [req.body.username], function (err, result) {
            console.log(result.length);
            if (result.length > 0) {
                // console.log(result[0].UserID);
                let obj = {
                    msg: "Successful",
                    result: result[0].UserID,
                }
                res.send(obj);
            } else {

                let sql = `INSERT INTO User (Username) VALUES ("${req.body.username}")`;

                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log('One record inserted');

                    let obj = {
                        msg: "Successful!",
                        result: result.insertId,
                    }
                    res.send(obj);
                });


            }
        })
    }

});

router.post('/quizes', function (req, res) {
    var sql = `SELECT * FROM Quiz WHERE QUserID = ${req.body.userId};`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post('/searchRating', function (req, res) {
    var sql = `SELECT * FROM Rating WHERE RatingUserID = ${req.body.userID};`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post('/updateRating', function (req, res) {
    let flashcardPackID = req.body.flashcardPackID;
    let flashcardPackNRatings = req.body.flashcardPackNRatings;
    let flashcardPackRating = req.body.flashcardPackRating;
    let flashcardPackRatingUser = req.body.flashcardPackRatingUser;
    let userID = req.body.userID;
    let oldRating = req.body.oldRating;
    let newNumOfRatings = flashcardPackNRatings;
    if (oldRating === 0) {
        newNumOfRatings = flashcardPackNRatings + 1;
        var sql = `INSERT INTO Rating (Rating, RatingUserID, RatingFlashcardPackID) VALUES (${flashcardPackRatingUser}, ${userID}, ${flashcardPackID});`;
        // console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            // console.log(result);
            // res.send(result);
        });
    } else {
        var sql = `UPDATE Rating SET Rating = ${flashcardPackRatingUser} WHERE RatingUserID = ${userID} AND RatingFlashcardPackID = ${flashcardPackID};`;
        // console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            // console.log(result);
            // res.send(result);
        });
    }

    var sql = `SELECT * FROM Rating WHERE RatingFlashcardPackID = ${flashcardPackID};`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        let sum = 0;
        for (let i = 0; i < result.length; i++) {
            sum += result[i].Rating;
        }
        console.log(sum);
        var sql1 = `UPDATE FlashcardPack SET FlashcardPackNRatings = ${newNumOfRatings}, FlashcardPackRating = ${sum / (result.length)} WHERE FlashcardPackID = ${flashcardPackID};`;
        con.query(sql1, function (err, result) {
            if (err) throw err;
            console.log(result);
        });
        res.send(result);
    });
});


router.post('/searchFC', function (req, res) {
    var sql = `SELECT * FROM FlashcardPack WHERE FlashcardPackName Like '%${req.body.searchTerm}%'  AND FlashcardPackID IN (SELECT FlashcardPack_FlashcardPackID FROM User_has_FlashcardPack WHERE MakerID <> ${req.body.userId}) AND FLanguageID = ${req.body.language};`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post('/checkFC', function (req, res) {
    var sql = `SELECT FlashcardPack_FlashcardPackID FROM User_has_FlashcardPack WHERE User_UserID = ${req.body.userId} AND FlashcardPack_FlashcardPackID = ${req.body.flashcardPackID} ;`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post('/checkFCP', function (req, res) {
    var sql = `SELECT FlashcardPack_FlashcardPackID FROM User_has_FlashcardPack WHERE User_UserID <> MakerID AND User_UserID = ${req.body.userId};`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post('/flashcardPacks', function (req, res) {
    var sql = `SELECT * FROM FlashcardPack WHERE FlashcardPackID IN (SELECT FlashcardPack_FlashcardPackID FROM User_has_FlashcardPack WHERE User_UserID = ${req.body.userId});`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post('/checkIfImageOnly', function (req, res) {
    var sql = `SELECT ImageOnly FROM FlashcardPack WHERE FlashcardPackID = ${req.body.FCPID};`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post('/flashcards', function (req, res) {
    var sql = `SELECT * FROM Flashcard WHERE FlashcardPackID = ${req.body.flashcardPackID};`;
    // console.log(req.body.flashcardPackID);
    // console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

router.post('/checkFlashcards', function (req, res) {
    if (req.body.flashcardPackID === undefined || req.body.flashcardPackID === '' || req.body.flashcardPackID === -1) {
        var sql = `SELECT * FROM Flashcard WHERE FlashcardPackID IN (SELECT FlashcardPack_FlashcardPackID FROM User_has_FlashcardPack WHERE User_UserID = ${req.body.userID})`;
        // console.log(req.body.flashcardPackID);
        // console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    } else {
        var sql = `SELECT * FROM Flashcard WHERE FlashcardPackID IN (SELECT FlashcardPack_FlashcardPackID FROM User_has_FlashcardPack WHERE User_UserID = ${req.body.userID} AND FlashcardPack_FlashcardPackID = ${req.body.flashcardPackID})`;
        // console.log(req.body.flashcardPackID);
        // console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
});

// router.get('/logout', function (req, res) {
//     req.session.destroy();
//     res.send("logout success!");
// });

router.get('/', function (req, res) {
    res.render('login');
});

// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "Flashcards"
// });

// con.connect(err => {
//     if (err) throw err;
// });


router.post("/deleteFlashcardPack", function (req, res) {
    let flashcardPackID = req.body.flashcardPackID;
    let userID = req.body.userID;
    console.log(userID);
    let sql = `DELETE FROM FlashcardPack WHERE FlashcardPackID = ${flashcardPackID};`;
    let sql1 = `DELETE FROM User_has_FlashcardPack WHERE FlashcardPack_FlashcardPackID = ${flashcardPackID} AND User_UserID = ${userID};`;
    con.query(sql1, function (err, result) {
        if (err) throw err;
        console.log("FlashcardPack record deleted");
    });
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("FlashcardPack record deleted");
        res.send(result);
    });

});

router.post("/removeFlashcardPack", function (req, res) {
    let flashcardPackID = req.body.flashcardPackID;
    let userID = req.body.userID;
    console.log(userID);
    let sql = `DELETE FROM User_has_FlashcardPack WHERE FlashcardPack_FlashcardPackID = ${flashcardPackID} AND User_UserID = ${userID};`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("FlashcardPack record deleted");
        res.send(result);
    });

});

router.post("/deleteFlashcard", function (req, res) {
    let flashcardID = req.body.flashcardID;
    let sql = `DELETE FROM Flashcard WHERE FlashcardID = ${flashcardID};`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Flashcard record deleted");
        res.send(result);
    });

});

router.post("/updateFlashcardPack", function (req, res) {
    let flashcardPackID = req.body.flashcardPackID;
    let flashcardPackName = req.body.flashcardPackName;
    let flashcardPackDescription = req.body.flashcardPackDescription;
    let imageOnly = req.body.imageOnly
    let sql = `UPDATE FlashcardPack SET FlashcardPackName = "${flashcardPackName}", FlashcardPackDescription = "${flashcardPackDescription}", FLanguageID = ${req.body.language}, ImageOnly = ${imageOnly} WHERE FlashcardPackID = ${flashcardPackID};`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('Record updated');
        res.send(result);
    });
});

router.post("/updateFlashcard", function (req, res) {
    let flashcardID = req.body.flashcardID;
    let flashcardName = req.body.flashcardName;
    let flashcardDescription = req.body.flashcardDescription;
    // let flashcardPackID = req.body.flashcardPackID;
    console.log(req.body.flashcardAudio);
    let buffer = '';
    if (req.body.flashcardAudio !== '' && req.body.flashcardAudio.message === undefined) {
        buffer = new Buffer.from(req.body.flashcardAudio)
    }
    console.log(flashcardName);
    if (buffer === '') {
        let sql = `UPDATE Flashcard SET FlashcardName = ?, FlashcardDescription = ? WHERE FlashcardID = ?;`;
        con.query(sql, [flashcardName, flashcardDescription, flashcardID], function (err, result) {
            if (err) throw err;
            console.log('Record updated');
            res.send(result);
        });
    } else {
        let sql = `UPDATE Flashcard SET FlashcardName = ?, FlashcardDescription = ?, FlashcardAudio = ?  WHERE FlashcardID = ?;`;
        con.query(sql, [flashcardName, flashcardDescription, buffer, flashcardID], function (err, result) {
            if (err) throw err;
            console.log('Record updated');
            res.send(result);
        });
    }
});

router.post("/updateFlashcard", function (req, res) {
    let flashcardID = req.body.flashcardID;
    let flashcardName = req.body.flashcardName;
    let flashcardDescription = req.body.flashcardDescription;
    // let flashcardPackID = req.body.flashcardPackID;
    // console.log(req.body.flashcardAudio);
    // if (req.body.flashcardAudio === '') {
    let sql = `UPDATE Flashcard SET FlashcardName = ?, FlashcardDescription = ? WHERE FlashcardID = ?;`;
    con.query(sql, [flashcardName, flashcardDescription, flashcardID], function (err, result) {
        if (err) throw err;
        console.log('Record updated');
        res.send(result);
    });
    // } else {
    //     let sql = `UPDATE Flashcard SET FlashcardName = ?, FlashcardDescription = ?, FlashcardAudio = ?  WHERE FlashcardID = ?;`;
    //     con.query(sql, [flashcardName, flashcardDescription, flashcardID, req.body.flashcardAudio.data], function (err, result) {
    //         if (err) throw err;
    //         console.log('Record updated');
    //         res.send(result);
    //     });
    // }
});

router.post("/addFlashcard", function (req, res) {
    let flashcardName = req.body.flashcardName;
    let flashcardDescription = req.body.flashcardDescription;
    let flashcardPackID = req.body.flashcardPackID;
    let flashcardImage = req.body.flashcardImage;
    let flashcardAudio = req.body.flashcardAudio;
    console.log(flashcardAudio);
    let buffer = new Buffer.from(flashcardImage.data.data);
    let buffer1 = '';

    if (flashcardAudio !== '') {
        if (flashcardAudio.data.data !== undefined) {
            buffer1 = new Buffer.from(flashcardAudio.data.data);
        } else {
            buffer1 = new Buffer.from(req.body.flashcardAudio);
        }


        let sql = `INSERT INTO Flashcard (FlashcardName, FlashcardDescription, FlashcardPackID, FlashcardImage, FlashcardAudio) VALUES (?, ?, ?, ?, ?);`;
        con.query(sql, [flashcardName, flashcardDescription, flashcardPackID, buffer, buffer1], function (err, result) {
            if (err) throw err;
            console.log('Record updated');
            res.send(result);
        });
    } else {
        let sql = `INSERT INTO Flashcard (FlashcardName, FlashcardDescription, FlashcardPackID, FlashcardImage) VALUES (?, ?, ?, ?);`;
        con.query(sql, [flashcardName, flashcardDescription, flashcardPackID, buffer], function (err, result) {
            if (err) throw err;
            console.log('Record updated');
            res.send(result);
        });
    }
});

router.post("/upload", function (req, res) {
    let flashcardImage = req.files.file;
    let buffer = new Buffer.alloc(flashcardImage.size, flashcardImage.data);
    let flashcardID = req.headers.id;

    if (flashcardID !== "undefined") {
        let sql = `UPDATE Flashcard SET FlashcardImage = ? WHERE FlashcardID = ?;`;
        console.log(flashcardID);
        con.query(sql, [buffer, flashcardID], function (err, result) {
            if (err) throw err;
            console.log('Record updated');
            res.send(result);
        });
    } else {
        // console.log("failed");
        console.log(flashcardImage);
        res.send(flashcardImage);
    }
});

router.post("/uploadAudio", function (req, res) {
    let flashcardAudio = req.files.file;
    let buffer = new Buffer.alloc(flashcardAudio.size, flashcardAudio.data);
    let flashcardID = req.headers.id;

    if (flashcardID !== "undefined") {
        let sql = `UPDATE Flashcard SET FlashcardAudio = ? WHERE FlashcardID = ?;`;
        console.log(flashcardID);
        con.query(sql, [buffer, flashcardID], function (err, result) {
            if (err) throw err;
            console.log('Record updated');
            res.send(result);
        });
    } else {
        // console.log("failed");
        console.log(flashcardAudio);
        res.send(flashcardAudio);
    }
});

router.post("/addFlashcardPack", function (req, res) {
    let flashcardPackName = req.body.flashcardPackName;
    let flashcardPackDescription = req.body.flashcardPackDescription;
    let userID = req.body.userID;
    let imageOnly = req.body.imageOnly

    if (req.body.flashcardPackID === '' || req.body.flashcardPackID === undefined) {
        let sql = `INSERT INTO FlashcardPack (FlashcardPackName, FlashcardPackDescription, FLanguageID, ImageOnly) VALUES ("${flashcardPackName}", "${flashcardPackDescription}", ${req.body.language}, ${imageOnly})`;

        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log('One record inserted');
            let sql1 = `INSERT INTO User_has_FlashcardPack (FlashcardPack_FlashcardPackID, User_UserID, MakerID) VALUES (${result.insertId}, ${userID}, ${userID})`;
            // console.log(result.insertId);
            con.query(sql1, function (err, result) {
                if (err) throw err;
                console.log('One record inserted');
            });
            res.send(result);
        });
    } else {
        var sql = `SELECT MakerID FROM User_has_FlashcardPack WHERE FlashcardPack_FlashcardPackID = ${req.body.flashcardPackID};`;
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            // console.log(result[0].MakerID);
            let sql1 = `INSERT INTO User_has_FlashcardPack (FlashcardPack_FlashcardPackID, User_UserID, MakerID) VALUES (${req.body.flashcardPackID}, ${userID}, ${result[0].MakerID})`;
            // console.log(result.insertId);
            con.query(sql1, function (err, result) {
                if (err) throw err;
                console.log('One record inserted');
                res.send(result);
            });

        });


    }
});

// // catch 404 and forward to error handler
// router.use(function (req, res, next) {
//     next(createError(404));
// });

// // error handler
// router.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.router.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });


module.exports = router;
