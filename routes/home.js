const express = require('express')
const { dbConnect } = require("../data/database");

const router = express.Router()

router.get('/',(req,res)=>{


    res.render('home.ejs',{
        'Name' : req.session.username,
        'isMember': req.session.member
    })

}) 

router.post('/',async (req,res,next)=>{
    
    // verify
    // if invalid user name password then go back to home with showing wrong password / username
     const form = req.body
     if(form['User Name'] != null){
        console.log("trying to verify")
        q1 = `select * from login_info where user_name = '${form['User Name']}' and password = '${form['Password']}'`
    var present = null
    var ismem = null 
    var expiry_date = null 
    q2 = `select user_id,expiry_date from membership natural join customer_info natural join login_info where expiry_date >= now()::date` 
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
        if(ismem != null && ismem == 1){
            expiry_date = result.rows[0].expiry_date
            console.log(result.rows[0])
            console.log(expiry_date.toISOString().slice(0, 10));
        }
        // console.log(exists);
    } catch (err) {
        next(err);
    }
    console.log("membership")
    console.log(ismem);
    // if already exists then valid user, so set username and password in session
    if(present!=null && present>0){
        req.session.login = null
        if(ismem!=null && ismem>0){
            req.session.member = 'Yes'
        }
        req.session.username = req.body['User Name']
    req.session.password = req.body['Password']
    res.redirect('/home')
    }
    else{
        req.session.login = 'Invalid username or password'
        res.redirect('/login')
    }
     }
     else{
        console.log("trying to add member")
        console.log(form)
        console.log(req.session.username)
        // get the user_id using login_info table, calculate expiry date
        q = `insert into membership(user_id,start_date,expiry_date) values(
            1,now()::date,now()::date + ${form['months']}
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
        console.log("here");
    } catch (err) {
        next(err);
    }
     }
    
    
});


module.exports = router
