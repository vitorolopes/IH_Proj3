// routes/auth-routes.js

const express    = require('express');
const authRoutes = express.Router();
// const router = express.Router() // --------->>>>>>>>>>>>>>

const passport   = require('passport');
const bcrypt     = require('bcryptjs');

// require the user model !!!!
const User       = require('../models/user-model');
// const uploadCloud = require('../configs/cloudinary.js'); // --------->>>>>>>>>>>>>>


authRoutes.post('/signup', (req, res, next) => {
    
     const {username, password, email, userimage} = req.body
   // const {username, password} = req.body
    
    if (!username || !password || !email ) {
      res.status(400).json({ message: 'Provide username, password and email' });
      return;
    }

    if(password.length < 3){
        res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
        return;
    }
  
    User.findOne({ username }, (err, foundUser) => {

        if(err){
            res.status(500).json({message: "Username check went bad."});
            return;
        }

        if (foundUser) {
            res.status(400).json({ message: 'Username taken. Choose another one.' });
            return;
        }
  
        const salt     = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);
  
        const aNewUser = new User({
            username:username,
            password: hashPass,
            email: email,
            userimage: userimage
        });
  
        aNewUser.save(err => {
            if (err) {
                console.log('error', err);
                res.status(400).json({ message: 'Saving user to database went wrong.' });
                return;
            }
            
            // Automatically log in user after sign up
            // .login() here is actually predefined passport method
            req.login(aNewUser, (err) => {

                if (err) {
                    res.status(500).json({ message: 'Login after signup went bad.' });
                    return;
                }
            
                // Send the user's information to the frontend
                // We can use also: res.status(200).json(req.user);
                res.status(200).json(aNewUser);
                console.log (aNewUser._id)
            });
        });
    });
});

// authRoutes.post('/upload', uploadCloud.single("userimage"), (req, res, next) => {  // --------->>>>>>>>>>>>>>
//     res.json({ userimage: req.file.secure_url });
//   })


authRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong authenticating user' });
            return;
        }
    
        if (!theUser) {
            // "failureDetails" contains the error messages
            // from our logic in "LocalStrategy" { message: '...' }.
            res.status(401).json(failureDetails);
            return;
        }
 
        // save user in session
        req.login(theUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }
 
            // We are now logged in (that's why we can also send req.user)
            res.status(200).json(theUser);
        });
    })(req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
    // req.logout() is defined by passport
    req.logout();
    res.status(200).json({ message: 'Log out success!' });
});
 
authRoutes.get('/loggedin', (req, res, next) => {
    // req.isAuthenticated() is defined by passport
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' });
});
 

module.exports = authRoutes;
