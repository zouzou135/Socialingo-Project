var express = require('express');
var router = express.Router();

const con = require("../DBConfig.js");

router.post('/', function (req, res) {

    var sql = "SELECT LanguageID FROM User_has_Language WHERE UserID = ? AND isLearning = ?";

    if (req.body.usersAdded) {
        sql = "SELECT LanguageID FROM User_has_Language WHERE UserID = ?";
    }

    con.query(sql, [req.body.userID, 1], function (err, result) {
        // console.log(result);
        let languages = result;
        // console.log(languages[0].LanguageID);
        let users = [];
        var count = 0;
        var sent = false;
        var inNotIn = "NOT IN";
        var orAnd = "AND";

        if (req.body.usersAdded) {
            inNotIn = "IN";
            orAnd = "OR";
        }

        // console.log(languages.length);

        for (let i = 0; i < languages.length; i++) {
            var sql1 = `SELECT * FROM User WHERE UserID IN (SELECT UserID FROM User_has_Language WHERE LanguageID = ${languages[i].LanguageID} AND isLearning = 0 AND (UserID ${inNotIn} (SELECT userID2 FROM ChatRooms WHERE userID1 = ?) ${orAnd} UserID ${inNotIn} (SELECT userID1 FROM ChatRooms WHERE userID2 = ${req.body.userID})))`;
            // if (req.body.usersAdded) {
            //     sql1 = `SELECT * FROM User WHERE UserID IN (SELECT UserID FROM User_has_Language WHERE UserID ${inNotIn} (SELECT userID2 FROM ChatRooms WHERE userID1 = ?) ${orAnd} UserID ${inNotIn} (SELECT userID1 FROM ChatRooms WHERE userID2 = ${req.body.userID}))`;
            // }

            con.query(sql1, [req.body.userID], function (err, result) {
                // console.log(languages[i], i, req.body.userID);
                if (err) throw err;

                // if (result.length === 0) {
                //     console.log(result);
                //     res.send(result);
                //     return;
                // }
                if (result.length > 0) {
                    var userResult = result;
                    for (let j = 0; j < userResult.length; j++) {
                        var sql2 = "SELECT * FROM Language WHERE LanguageID IN (SELECT LanguageID FROM User_has_Language WHERE UserID = ? AND isLearning = 0)";
                        con.query(sql2, [userResult[j].UserID], function (err, result) {
                            // console.log(result);
                            var knownLang = result;

                            var sql3 = "SELECT * FROM Language WHERE LanguageID IN (SELECT LanguageID FROM User_has_Language WHERE UserID = ? AND isLearning = 1)";
                            con.query(sql3, [userResult[j].UserID], function (err, result) {
                                // console.log(result);
                                var langToLearn = result;

                                let obj = {
                                    user: userResult[j],
                                    knownLang: knownLang,
                                    langToLearn: langToLearn,
                                }

                                let isAdded = false;
                                for (var iter = 0; iter < users.length; iter++) {
                                    if (obj.user.UserID == users[iter].user.UserID) {
                                        isAdded = true;
                                    }
                                    console.log(users[iter].user.UserID);
                                    console.log(isAdded);
                                }
                                if (!isAdded) {
                                    users.push(obj);
                                }

                                count++;
                                var count1 = 0;
                                for (let z = 0; z < languages.length; z++) {
                                    var sql4 = `SELECT * FROM User WHERE UserID IN (SELECT UserID FROM User_has_Language WHERE LanguageID = ${languages[z].LanguageID} AND isLearning = 0 AND (UserID ${inNotIn} (SELECT userID2 FROM ChatRooms WHERE userID1 = ?) ${orAnd} UserID ${inNotIn} (SELECT userID1 FROM ChatRooms WHERE userID2 = ${req.body.userID})))`;
                                    // if (req.body.usersAdded) {
                                    //     sql4 = `SELECT * FROM User WHERE UserID IN (SELECT UserID FROM User_has_Language WHERE UserID ${inNotIn} (SELECT userID2 FROM ChatRooms WHERE userID1 = ?) ${orAnd} UserID ${inNotIn} (SELECT userID1 FROM ChatRooms WHERE userID2 = ${req.body.userID}))`;
                                    // }
                                    con.query(sql4, [req.body.userID], function (err, result) {
                                        if (err) throw err;
                                        if (result.length > 0) {
                                            count1 += result.length;
                                            // console.log(count, count1);
                                        }
                                        if ((count === count1) && (j === userResult.length - 1) && !sent) {
                                            // console.log(users);
                                            res.send(users);
                                            sent = true;
                                        }
                                    });
                                }
                                // res.send(result[0]);
                            });
                            // res.send(result[0]);
                        });
                    }
                }
            });
        }
    });
});

router.post('/numberOfChats', function (req, res) {

    var newUsersArray = req.body.usersArray;
    var numberOfChats = [];
    for (let i = 0; i < req.body.usersArray.length; i++) {
        var sql = `SELECT ChatRoomsID FROM ChatRooms WHERE userID1 = ${req.body.usersArray[i].user.UserID} OR userID2 = ${req.body.usersArray[i].user.UserID}`;
        con.query(sql, function (err, result) {
            numberOfChats.push(result.length);
            console.log(req.body.usersArray[i].user.UserID);
            console.log(result.length);
            console.log(numberOfChats);

            if (i === req.body.usersArray.length - 1) {
                for (let j = 0; j < req.body.usersArray.length; j++) {
                    var key = numberOfChats[j];
                    var userKey = newUsersArray[j];
                    var z = j - 1;

                    while (z >= 0 && numberOfChats[z] > key) {
                        numberOfChats[z + 1] = numberOfChats[z];
                        newUsersArray[z + 1] = newUsersArray[z];
                        z--;
                    }
                    numberOfChats[z + 1] = key;
                    newUsersArray[z + 1] = userKey;
                }
                res.send(newUsersArray);
            }
        })
    }

});

router.post('/addToChat', function (req, res) {
    var sql = `INSERT INTO ChatRooms (UserID1, UserID2) VALUES (${req.body.userID}, ${req.body.otherUserID})`;
    con.query(sql, [req.body.userID], function (err, result) {
        console.log(result);
        res.send(result);
    })
});

router.post('/picture', function (req, res) {

    var sql = "SELECT ProfilePicture FROM User where userID = ?";
    con.query(sql, [req.body.userID], function (err, result) {
        console.log(result[0]);
        res.send(result[0]);
    })
});

module.exports = router;