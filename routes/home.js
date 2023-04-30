const express = require('express')
const { dbConnect } = require("../data/database");

const { localsName } = require('ejs');
const router = express.Router()

router.get('/', (req, res) => {


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

router.get('/book', async (req, res, next) => {

    var sort = req.query['pricing']
    var location = req.query['location']
    var car_category = req.query['car category']

    if (sort == undefined) {
        sort = null
    }

    if (location == undefined) {
        location = null
    }

    if (car_category == undefined) {
        car_category = null
    }

    console.log(req.query)

    // q = `select * from car natural join car_category natural join location`

    let q = `
    SELECT *
    FROM car
    JOIN car_category ON car.category_id = car_category.category_id
    JOIN location ON car.location_id = location.location_id
    WHERE 1=1
    `

    if (location) {
        q += `AND location.location_name = '${location}' `;
    }

    if (car_category) {
        q += `AND car_category.category_name = '${car_category}' `;
    }

    if (sort === 'high to low') {
        q += `ORDER BY car_category.cost_perday DESC`;
    } else if (sort === 'low to high') {
        q += `ORDER BY car_category.cost_perday ASC`;
    }

    var data = null

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
        data = result.rows
    } catch (err) {
        next(err);
    }

    console.log(data)

    q = `select category_name from car_category`
    var category_name = null

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
        category_name = result.rows
    } catch (err) {
        next(err);
    }

    q = `select location_name from location`
    var location_name = null

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
        location_name = result.rows
    } catch (err) {
        next(err);
    }

    // res.send('Query parameters captured successfully');

    res.render('book.ejs', {
        data: data,
        category_name: category_name,
        location_name: location_name
    })

})



router.get('/pooling', (req, res) => {

    res.render('pooling.ejs')

})


module.exports = router
