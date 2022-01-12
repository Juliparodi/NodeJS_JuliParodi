const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/user');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook').Strategy;

passport.use(new LocalStrategy(
    function (email, password, done) {
        Usuario.findOne({ email: email }, function (err, usuario) {
            if (err) return done(err);
            if (!usuario) return done(null, false, { message: 'Email no existe o incorrecto' });
            if (!usuario.validPassword(password)) return done(null, false, { message: 'Password incorrecto' });
            
            return done(null, usuario);
        });
    }
));

/*

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        Usuario.findOneCreateByGoogle(profile, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET
},
    function (accessToken, refreshToken, profile, done) {
        try {
            Usuario.findOrCreateByFacebook(profile, function (err, user) {
                if (err) console.log(err);
                return done(err, user);
            });

        } catch (err2) {
            console.log(err2);
            return done(err2, null);
        }
    })
);
*/

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    Usuario.findById(id, function (err, usuario) {
        cb(err, usuario);
    });
});

module.exports = passport;