const express = require('express')

const router = express.Router()

router.get('/',(req,res)=>{

    res.render('become_member.ejs',{
        'Name' : req.session.username
    })    

})


module.exports = router