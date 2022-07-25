const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function (user, done) {
   done(null, user);
});

passport.deserializeUser(function (user, done) {
   done(null, user); 
});

passport.use(new GoogleStrategy({
    clientID:"593044077498-at92pm6j21o9ep7tt67kv53j7pho54go.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:500/google/callback",
    passReqToCallback: true
},
function(request, accessToken, refrestToken, profile, done) {
    return done(null, profile);
}
));