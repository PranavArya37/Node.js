const express = require('express')
const app = express()
const { pool } = require("./dbConfig")
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')

const initializePassport = require ('./passportConfig')

initializePassport(passport)

const port = process.env.PORT || 4000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.get('/', (req, res) => {
  res.render("index")
})

app.get('/users/register', checkAuthenticated, (req, res) => {
  res.render("register")
})

app.get('/users/login', checkAuthenticated, (req, res) => {
  res.render("login")
})

app.get('/users/dashboard', checkNotAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user.name })
})

app.get('/users/logout', (req, res) => {
  req.logOut;
  req.flash('success_msg', "You Have Logged Out Successfully");
  res.redirect('/users/login')
});

app.post('/users/register', async (req, res) => {
  let { name, email, password, password2 } = req.body;
  console.log({
    name,
    email,
    password,
    password2
  });

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please Enter All The Fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password Should Be Atleast 6 Characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords Do Not Match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors })
  } else {
    // Form validation has passed

    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM users
      WHERE email = $1`, [email], (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);

      if(results.rows.length > 0){
        errors.push({message: "Email Already Registered"});
        res.render("register", { errors })
      }else{
        pool.query(
          `INSERT INTO users (name, email, password)
          VALUES ($1, $2, $3)
          RETURNING id, password`,[name, email, hashedPassword], (err, results) => {
            if (err) {
              throw err;
            }
            console.log(results.rows)
            req.flash('success_msg', "You Are Now Registered. Please Log In")
            res.redirect('/users/login')
          }
        )
      }
    }
    );
  }

});

app.post("/users/login", passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}))

function checkAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return res.redirect('/users/dashboard')
  }
  next();
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/users/login')
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})