const { response, application } = require('express')
// const { dbConnect } = require("../data/database");
const pkg  = require("pg");
const {Client} = pkg;
const express = require('express');
const session = require('express-session');

const router = express.Router()

router.get('/', async (req, res, next) => {

    const dbConnect = new Client({
        host: "localhost",
        user: req.session.username,
        port: 5432,
        password: req.session.username,
        database: "car_rental"
    });

    dbConnect.connect()
        .then(() => console.log("Database Connected"))
        .catch((e) => console.log(e));


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

    // console.log(req.query)

    // q = `select * from car natural join car_category natural join location`

    let q = `
    SELECT *
    FROM car
    JOIN car_category ON car.category_id = car_category.category_id
    JOIN location ON car.location_id = location.location_id
    WHERE 1=1 AND availability = 1
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

    // console.log(data)

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
    dbConnect.end();

    res.render('book.ejs', {
        data: data,
        category_name: category_name,
        location_name: location_name,
        Name: req.session.username
    })

})

router.get('/:registration_no', async (req, res, next) => {

    const dbConnect = new Client({
        host: "localhost",
        user: req.session.username,
        port: 5432,
        password: req.session.username,
        database: "car_rental"
    });

    dbConnect.connect()
        .then(() => console.log("Database Connected"))
        .catch((e) => console.log(e));

    console.log('inside the payment')

    q = `select * from car where registration_no = '${req.params.registration_no}'`
    let carinfo = null

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
        carinfo = result.rows[0]
    } catch (err) {
        next(err);
    }



    q = `select * from location where location_id = ${carinfo.location_id}`
    let pick_up_loc = null

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
        pick_up_loc = result.rows[0]
    } catch (err) {
        next(err);
    }


    q = `select * from car_category where category_id = ${carinfo.category_id}`
    let car_category = null

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
        car_category = result.rows[0]
    } catch (err) {
        next(err);
    }

    console.log(pick_up_loc)


    q = `select * from location`
    var location = null

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
        location = result.rows
    } catch (err) {
        next(err);
    }

    dbConnect.end()

    res.render('payment.ejs', {
        username: req.session.username,
        pick_up_loc: pick_up_loc,
        car_category: car_category,
        registration_no: req.params.registration_no,
        carinfo: carinfo,
        location: location
    })
})


var getlocid = async (location_name,dbConnect) => {

    q = `select * from location where location_name = '${location_name}'`
    var location_id = null

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
        location_id = result.rows[0].location_id
    } catch (err) {
        next(err);
    }

    console.log(location_id)

    return location_id
}


router.post('/payment/booked', async (req, res, next) => {


    const dbConnect = new Client({
        host: "localhost",
        user: req.session.username,
        port: 5432,
        password: req.session.username,
        database: "car_rental"
    });

    dbConnect.connect()
        .then(() => console.log("Database Connected"))
        .catch((e) => console.log(e));

    console.log(req.body)

    let htmlTime = req.body['start time'] // example HTML time string
    let date = new Date(htmlTime); // convert HTML time to Date object
    const start_time = date.toISOString().replace('T', ' ').slice(0, -5); // format Date object as Postgres timestamp string

    htmlTime = req.body['end time'] // example HTML time string
    date = new Date(htmlTime); // convert HTML time to Date object
    const end_time = date.toISOString().replace('T', ' ').slice(0, -5); // format Date object as Postgres timestamp string

    // console.log(postgresTimestamp); // prints "2023-05-01 12:30:45"

    q = `select * from login_info where user_name = '${req.body.username}'`
    var user_id = null

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
        user_id = result.rows[0].user_id
    } catch (err) {
        next(err);
    }

    // console.log(new Date())

    let today = new Date()
    today = today.toISOString().slice(0, 10)
    console.log(today)

    pickuplocid = await getlocid(req.body['pickup location'],dbConnect)
    droplocid = await getlocid(req.body['drop location'],dbConnect)

    // return

    q = `
    insert into booking(user_id,start_time,end_time,pickup_location,drop_location,booking_date,pooling_option,insurance_option,registration_no,cancelled_status,advance_paid)
    values (
        ${user_id},'${start_time}','${end_time}',${pickuplocid},${droplocid},'${today}','${req.body['pooling option']}',
        '${req.body['insurance option']}','${req.body.registration_no}','NO','YES'
    )
    `

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

        console.log('working')

    } catch (err) {
        next(err);
    }

    dbConnect.end()

    res.redirect('/home')

})


module.exports = router
