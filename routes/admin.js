const express = require('express')
const { dbConnect } = require("../data/database");
const router = express.Router()

router.get('/', (req, res) => {

    res.render('admin.ejs')

})

router.post('/', (req, res) => {

    res.render('admin.ejs')

})

// Car
// can have new route for sorting the data

router.get('/view_car', async (req, res) => {

    q = `select * from car`
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

    res.render('view_car.ejs', { data : data })

})

router.post('/view_car', (req, res) => {

    const form = req.body

    q = `insert into car(model_name , registration_no , capacity , mileage , availability , category_id , location_id) values 
    (
        '${form['Model Name']}','${form['Registration Number']}', '${form['Capacity']}','${form['Mileage']}', 0 ,123,123
    )`

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/view_car');
        }
    });

})


router.get('/add_car', (req, res) => {

    res.render('add_car.ejs')

})


// car category

router.get('/view_car_category', (req, res) => {

    res.render('view_car_category.ejs')

})

router.get('/add_car_category', (req, res) => {

    res.render('add_car_category.ejs')

})


// location

router.get('/view_location', async (req, res, next) => {

    q = `select * from location`
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

    res.render('view_location.ejs', { data: data })

})

router.post('/view_location', (req, res) => {

    const form = req.body

    q = `insert into location(location_name,city,state,street,pincode) values 
    (
        '${form['Location Name']}','${form['City']}', '${form['State']}','${form['Street']}', ${form['Pincode']} 
    )`

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/view_location');
        }
    });
})

router.get('/add_location', (req, res) => {

    res.render('add_location.ejs')

})


// maintainace

router.get('/view_maintainance', (req, res) => {

    res.render('view_car_maintainance.ejs')

})

router.get('/edit_maintainance', (req, res) => {

    res.render('edit_car_maintainace.ejs')

})



module.exports = router
