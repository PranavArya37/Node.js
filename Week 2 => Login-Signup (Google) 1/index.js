const express = require('express');
const app = express();
const passport = require('passport');

require("dotenv").config();
require('./passport');

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(passport.initialize());


// Routes
app.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "consent",
      session: false,
    })
  );
  
  app.get(
    "/",
    passport.authenticate("google", {
      session: false,
      successRedirect: "/success",
      failureRedirect: "/fail",
    })
  );
  
  app.get("/success", (req, res) => {
    res.send("User Logged In");
  });
  
  app.get("/fail", (req, res) => {
    res.send("Login failed");
  });

  
app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`);
});