const moment = require("moment");

const connection = require("../db/mysql_connection");

// @desc    책 불러오기
// @route   get    /api/v1/book
// @request offset,limit
//@response success,items

exports.getbooks = async (req, res, next) => {

    let offset = req.query.offset
    let limit = req.query.limit

    let query = `select * from book limit ${offset},${limit}`


    try {
        [rows] = await connection.query(query);
        res.status(200).json({ success: true, items: rows })
    } catch (e) {
        res.status(500).json({ success: false, error: e })
    }
}

// @desc    책 대여하기
// @route   post/api/v1/book/borrow
// @request 
//@response success
exports.borrowbook = async (req, res, next) => {

    let title = req.body.title;
    let query = "select*from book as b left join book_user as u on b.id=u.id left join book_user_token as t on u.id = t.id where title= ?"
    let data = [title];
    [rows] = await connection.query(query, data);
    for (let i = 0; i < rows.length; i++) {
        let user_id = rows[i].user_id;
        let age = rows[i].age;
        limit_age = rows[i].limit_age;

        console.log(user_id);
        console.log(age)
        console.log(limit_age)

        let limit_date = Date.now();
        let after_date = limit_date + 1000 * 60 * 1440 * 7;
        let compareTime = moment(after_date).format("YYYY-MM-DD HH:mm:ss");

        console.log(after_date);
        console.log(compareTime);

        query = "insert into book_rental (title, user_id,limit_date) values (?,?,?)";
        let data = [title, user_id, compareTime];
        if (age > limit_age) {
            try {
                [result] = await connection.query(query, data);
                res.status(200).json({ success: true });
            } catch (e) {
                res.status(500).json({ error: e });
            }
        } else {
            res.status(400).json({ message: "연령대가 맞지 않습니다" })
        }

    }
};


// @desc    대여목록 불러오기
// @route   get/api/v1/book/borrowed
// @request offset,limit
//@response success,items


exports.getborrowbooks = async (req, res, next) => {

    let offset = req.query.offset
    let limit = req.query.limit


    let query = `select title, rental_date, limit_date from book_rental limit ${offset},${limit}`


    try {
        [rows] = await connection.query(query);
        res.status(200).json({ success: true, items: rows })
    } catch (e) {
        res.status(500).json({ success: false, error: e })
    }
}

// @desc        책반납
// @route       DELETE /api/v1/book/:id
// @request     id, user_id(auth)
// @response    success

exports.deleteReservation = async (req, res, next) => {
    let id = req.params.id;
    let user_id = req.user.id;



    let query = "select * from book_rental where id = ? ";
    let data = [id];

    try {
        [rows] = await connection.query(query, data);
        res
            .status(400)
            .json({ success: true });
        return;

    } catch (e) {
        res.status(500).json();
    }

    query = "delete from book_rental where id = ? ";
    data = [user_id];

    try {
        [result] = await connection.query(query, data);
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json();
    }
};
