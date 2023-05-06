const express = require('express')

const router = express.Router()

router.get('/',(req,res)=>{

    res.render('become_member.ejs',{
        'Name' : req.session.username,
        isMember : req.session.member,
        expiry_date : req.session.expiry_date
    })    

})


module.exports = router
