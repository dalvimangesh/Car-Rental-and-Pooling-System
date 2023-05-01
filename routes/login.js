const { response, application } = require('express')
const { dbConnect } = require("../data/database");

const express = require('express')

const router = express.Router()

router.get('/',(req,res)=>{

    if( req.session.username ) {
        res.redirect('/home')
        return
    }

    res.render('login.ejs',{
        login_msg : req.session.login
    })
})

router.post('/',async (req,res,next)=>{
    // connect to database and add info to customer_info table
    const form = req.body
    q1 = `select * from customer_info where user_name = '${form['User Name']}'`
    var present = null
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

    // if some username already exists then shouldnt allow
    if(present!=null && present>0){
        req.session.register_message = 'User name already exists'
        res.render('registration.ejs',{
            register_message:req.session.register_message
        })
    }
    else{
    q = `insert into customer_info(first_name , last_name , phone_no , driving_license_id , password , user_name ) values 
    (
        '${form['First name']}','${form['Last name']}', ${form['Phone No']},'${form['Driving license ID']}', '${form['Password']}' , '${form['User Name']}' 
    )`

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/login')
        }
    });
    }
})

module.exports = router
