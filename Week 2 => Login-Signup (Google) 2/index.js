// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

require('./passport');

var app = express();
var server = http.Server(app);
var port = process.env.PORT || 500;

app.set('port', port);
app.use(express.static(path.join(__dirname, 'static/images')))
app.use(bodyParser.urlencoded({ extended: true, limit: '80mb', parameterLimit: 100000 }));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// Routing
app.get('/logout', function (req, response) {
    if (req.session.loggedin) {
        req.session.destroy();
        response.redirect("/");
        response.end()
    } else {
        response.redirect("/");
        response.end()
    }
});


app.get('/welcome', function (req, response) {
    if (req.session.loggedin) {
        response.sendFile(path.join(__dirname, "static/displayEmail.html"))
    } else {
        response.write("access denied");
        response.end();
    }
});

app.get('/getData', function (req, response) {
    if (req.session.loggedin) {
        var data = JSON.stringify(req.session.userData);
        response.write(data);
        response.end();
    } else {
        response.write("access denied");
        response.end();
    }
});



app.get('/', function (req, response) {
    if (req.session.loggedin) {
        response.redirect("/welcome")
        response.end();
    } else {
        response.sendFile(path.join(__dirname, "static/login.html"));
    }
});

app.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

app.get('/google/callback', passport.authenticate('google', {
    failureRedirect: "/",
}), function(req,response){
    req.session.userData = {
        profile: req.user.photos[0].value,
        email: req.user.email
    };
    req.session.loggedin = true;;

    response.redirect("/welcome");
    response.end();
});

server.listen(port, function () {
    console.log(`Starting server on port ${port}`);
});
console.clear();