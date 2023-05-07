const db = require('../lib/db');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
module.exports = function(app){

    const passport = require('passport');
    const LocalStrategy = require('passport-local');

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done)=>{
        console.log("serializeUser", user);
        done(null, user.email);
    });
    passport.deserializeUser((id,done)=>{
        const user = db.get('users').find({email:id}).value();

        console.log("deserializeUser", id, user);
        done(null,user);
    });


    passport.use(new LocalStrategy(
        {
            usernameField:'email',
            passwordField:'pwd'
        },
        function(email, password, done) {
            console.log("LocalStrategy", email, password);
            const user = db.get('users').find({email:email}).value();
            if(user){
                bcrypt.compare(password,user.pwd,(err,result)=>{
                    if(result){
                        return done(null, user, {message: 'welcome'});
                    } else {
                        return done(null, false, {message: 'not pwd'});
                    }
                });
            } else {
                return done(null, false, {message: 'not email'});
            }
        }
    ));
    return passport;
}