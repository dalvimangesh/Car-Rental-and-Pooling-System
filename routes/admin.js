const express = require('express')

const router = express.Router()

router.get('/',(req,res)=>{

    res.render('admin.ejs')

}) 

router.post('/',(req,res)=>{

    res.render('admin.ejs')

})

module.exports = router
