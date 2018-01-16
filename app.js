const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
  
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


app.get('/', cookieTimeCheckMiddleware, (req, res) => {
    res.render('time.pug', { time: req.cookies.time});
});

app.get('/myroute/:param', (req, res) => {

    const param = req.params.param,
        queryParam = req.query.param ? req.query.param : '',
        headerParam = req.get(param) ? req.get(param) : '',
        sessionParam = req.session.param ? req.session.param : '',
        cookieParam =  req.cookies.param ? req.cookies.param : '';
    res.render('param.pug', { param, queryParam, sessionParam, cookieParam, headerParam});
});

app.listen(3000, () => {
    console.log('server started')
});

// Middleware functions
function cookieTimeCheckMiddleware(req, res, next) {
    if (!req.cookies.time) {
        res.cookie('time', new Date().toString());
    }
    next();
}