const { response, application } = require('express')
const { dbConnect } = require("../data/database");

const express = require('express')

const router = express.Router()


var getlocid = async (location_name) => {

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

var getlocname = async (location_id) => {

    q = `select * from location where location_id = '${location_id}'`
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
        location_name = result.rows[0].location_name
    } catch (err) {
        next(err);
    }

    console.log(location_name)

    return location_name
}

var getuserid = async (user_name) => {

    console.log('user_name -> ',user_name)
    // return

    q = `select * from login_info where user_name = '${user_name}'`

    console.log(user_name , q)

    // return

    // console.log(q)

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

    console.log(user_id)

    return user_id
}

var getcount = async (bookid) => {

    q = `select get_count_bookingid(${bookid});`
    var no_of_people = null

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
        no_of_people = result.rows[0].get_count_bookingid

    } catch (err) {
        next(err);
    }

    // console.log(no_of_people + 1)
    return no_of_people+1

}

router.get('/', async (req, res, next) => {



    var sort = req.query['pricing']
    var pickup_location = req.query['pick location']
    var drop_location = req.query['drop location']
    var car_category = req.query['car category']

    // console.log(pickup_location, drop_location)

    if (sort == undefined) {
        sort = null
    }

    if (pickup_location == undefined) {
        pickup_location = null
    }
    else {
        pickup_location = await getlocid(pickup_location)
    }

    if (drop_location == undefined) {
        drop_location = null
    }
    else {
        drop_location = await getlocid(drop_location)
    }

    if (car_category == undefined) {
        car_category = null
    }

    // console.log(req.query)

    // q = `select * from car natural join car_category natural join location`

    // CHANGE THIS LINE

    console.log(req.session.username)
    // return

    user_id = await getuserid(req.session.username)

    let q = `
    SELECT * FROM get_pooling_cars(${user_id}) WHERE 1=1
    `

    if (pickup_location) {
        q += `AND pickup_location = '${pickup_location}' `;
    }

    if (drop_location) {
        q += `AND drop_location = '${drop_location}' `;
    }

    if (car_category) {
        q += `AND category_name = '${car_category}' `;
    }

    if (sort === 'high to low') {
        q += `ORDER BY cost_perday DESC`;
    } else if (sort === 'low to high') {
        q += `ORDER BY cost_perday ASC`;
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

    
    var final_data = []
    console.log(data)

    if (data) {
        for (const element of data) {
            element.pickup_location = await getlocname(element.pickup_location);
            element.drop_location = await getlocname(element.drop_location);
            element.count = await getcount(element.book_id);
            element.count = await getcount(element.book_id);
            final_data.push(element);
        }
    } else {
        final_data = data;
    }

    console.log(final_data)
    

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

    res.render('pooling.ejs', {
        data: final_data,
        category_name: category_name,
        location_name: location_name,
        Name : req.session.username
        
    })
})


router.get('/:registration_no/:start_time/:end_time/:drop_loc/:book_id', async (req, res, next) => {

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

    console.log(new Date(req.params.start_time).toISOString().slice(0, -8))

    res.render('pooling_payment.ejs', {
        username: req.session.username,
        pick_up_loc: pick_up_loc,
        car_category: car_category,
        registration_no: req.params.registration_no,
        carinfo: carinfo,
        drop_location: req.params.drop_loc,
        start_time : new Date(req.params.start_time).toISOString().slice(0, -8),
        end_time : new Date(req.params.end_time).toISOString().slice(0, -8),
        book_id : req.params.book_id
    })
})



router.post('/payment/booked/:booking_id', async (req, res, next) => {


    console.log(req.body)

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

    q =  `
    insert into pooling(user_id,booking_id,cancelled_status,insurance_option)
    values (
        ${user_id},${req.params.booking_id},'NO',${req.body['insurance option']}
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

    res.redirect('/home')
})


module.exports = router
