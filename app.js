const express = require('express')
const ejs = require('ejs')

const app = express()

app.set('view engine','ejs')


const login = require('./routes/login')
app.use('/login',login)

const registration = require('./routes/registration')
app.use('/register',registration)


app.listen(5000,(req,res)=>{
    console.log('server is working')
})
