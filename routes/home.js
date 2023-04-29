const express = require('express')

const router = express.Router()

router.get('/',(req,res)=>{

    console.log(req)

    res.render('home.ejs',{
        'Name' : req.session.username
    })

}) 

router.post('/',(req,res)=>{
    
    // verify

    req.session.username = req.body['User Name']
    req.session.passward = req.body['Password']

    res.redirect('/home')
})


module.exports = router
