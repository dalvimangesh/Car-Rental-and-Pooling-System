const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser') 
const app = express()

app.set('view engine','ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

const login = require('./routes/login')
app.use('/login',login)

const registration = require('./routes/registration')
app.use('/register',registration)

const home = require('./routes/home')
app.use('/home',home)

app.listen(5000,(req,res)=>{
    console.log('server is working')
})
