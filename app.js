const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session');

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const login = require('./routes/login')
app.use('/login', login)

const registration = require('./routes/registration')
app.use('/register', registration)


const home = require('./routes/home')
app.use('/home', home)


const check = (req, res, next) => {
    if (req.session.username == undefined) {
        res.redirect('/login')
        return
    }
    next()
}

app.use(check)

const admin = require('./routes/admin')
app.use('/admin', admin)

const become_member = require('./routes/become_member')
app.use('/become_member', become_member)

app.listen(5000, (req, res) => {
    console.log('server is working')
})
