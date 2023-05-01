const { response, application } = require('express')
const { dbConnect } = require("../data/database");

const express = require('express')

const router = express.Router()


router.get('/pooling', async (req, res) => {

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

    res.render('pooling.ejs', {
        data: data,
        category_name: category_name,
        location_name: location_name
    })

})


module.exports = router
