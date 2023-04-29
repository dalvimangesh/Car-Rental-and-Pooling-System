const express = require('express')

const router = express.Router()

router.get('/',(req,res)=>{

    res.render('admin.ejs')

}) 

router.post('/',(req,res)=>{

    res.render('admin.ejs')

})

// Car

router.get('/view_car',(req,res)=>{

    res.render('view_car.ejs')

})


router.get('/add_car',(req,res)=>{

    res.render('add_car.ejs')

})


// car category

router.get('/view_car_category',(req,res)=>{

    res.render('view_car_category.ejs')

})

router.get('/add_car_category',(req,res)=>{

    res.render('add_car_category.ejs')

})


// location

router.get('/view_location',(req,res)=>{

    res.render('view_location.ejs')

})

router.get('/add_location',(req,res)=>{

    res.render('add_location.ejs')

})


// maintainace

router.get('/view_maintainance',(req,res)=>{

    res.render('view_car_maintainance.ejs')

})

router.get('/edit_maintainance',(req,res)=>{

    res.render('edit_car_maintainace.ejs')

})



module.exports = router
