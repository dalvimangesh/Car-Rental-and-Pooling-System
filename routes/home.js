const express = require('express')
const { dbConnect } = require("../data/database");
const router = express.Router()

router.get('/', (req, res) => {


    res.render('home.ejs', {
        'Name': req.session.username,
        isMember: req.session.member,
        expiry_date: req.session.expiry_date
    })

})



router.post('/', async (req, res, next) => {

    // verify
    // if invalid user name password then go back to home with showing wrong password / username
    const form = req.body
    if (form['User Name'] != null) {
        console.log("trying to verify")
        q1 = `select * from login_info where user_name = '${form['User Name']}' and password = '${form['Password']}'`
        var present = null
        var ismem = null
        var expiry_date = null
        q2 = `select user_id,expiry_date from membership natural join login_info where expiry_date >= now()::date and user_name = '${form['User Name']}'`
        try {
            const result = await new Promise((resolve, reject) => {
                dbConnect.query(q1, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
                );
            });
            present = result.rows.length;
            // console.log(exists);
        } catch (err) {
            next(err);
        }

        try {
            const result = await new Promise((resolve, reject) => {
                dbConnect.query(q2, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
                );
            });
            ismem = result.rows.length;
            if (ismem != null && ismem > 0) {
                expiry_date = result.rows[0].expiry_date
            }
            // console.log(exists);
        } catch (err) {
            next(err);
        }
        console.log("membership")
        console.log(ismem);
        // if already exists then valid user, so set username and password in session
        if (present != null && present > 0) {
            req.session.login = null
            if (ismem != null && ismem > 0) {
                req.session.member = 'Yes'
                req.session.expiry_date = expiry_date
                console.log("ofnwdnrng")
                console.log(req.session.member)
            }
            else {
                req.session.member = 'No'
            }
            req.session.username = req.body['User Name']
            req.session.password = req.body['Password']
            res.redirect('/home')
        }
        else {
            req.session.login = 'Invalid username or password'
            res.redirect('/login')
        }
    }
    else {
        console.log("trying to add member")
        console.log(form)
        console.log(req.session.username)
        userid = 1
        // query to get the userid using user name
        q1 = `select user_id from login_info where user_name = '${req.session.username}'`

        try {
            const result = await new Promise((resolve, reject) => {
                dbConnect.query(q1, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
                );
            });
            // console.log(result)
            userid = result.rows[0].user_id
        } catch (err) {
            next(err);
        }

        // get the user_id using login_info table, calculate expiry date

        q = `insert into membership(user_id,start_date,expiry_date) values(
            ${userid},now()::date,now()::date + ${form['months']}
        )`
        try {
            const result = await new Promise((resolve, reject) => {
                dbConnect.query(q, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
                );
            });
        } catch (err) {
            next(err);
        }
        // getting expiry date
        q2 = `select user_id,expiry_date from membership natural join customer_info 
        natural join login_info where expiry_date >= now()::date and user_name = '${req.session.username}'`
        try {
            const result = await new Promise((resolve, reject) => {
                dbConnect.query(q2, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
                );
            });
            expiry_date = result.rows[0].expiry_date.toISOString().slice(0, 10);
            req.session.member = 'Yes'
            req.session.expiry_date = expiry_date

            // console.log(exists);
        } catch (err) {
            next(err);
        }
        console.log("Now")
        console.log(expiry_date)
        res.render('home.ejs', {
            'Name': req.session.username,
            isMember: 'Yes',
            'expiry_date': expiry_date
        });
    }


});

const book = require('../routes/book')
router.use('/book', book)

const pooling = require('../routes/pooling')
router.use('/pooling', pooling)



module.exports = router