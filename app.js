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
const { urlencoded } = require('express')
app.use('/register',registration)


app.listen(5000,(req,res)=>{
    console.log('server is working')
})
