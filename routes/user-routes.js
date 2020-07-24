const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const uploadCloud = require('../configs/cloudinary.js');
const User = require('../models/user-model')
const { response } = require('../app')

// CREATE userimage route
router.post('/upload', uploadCloud.single("imageUrl"), (req, res, next) => {
  res.json({ imageUrl: req.file.secure_url });
})



router.post('/updateprofile', (req, res, next) => {
  console.log("req.body UPDATE PROFILE ROUTE")
  console.log(req.body)

  console.log(req.session)
  // console.log(req.session.passport.user)
   console.log("User", req.user)
  console.log(req.user._id)

  // const userimage = req.body.userimage
  const {userimage, username, email} = req.body
  
  
      User.findByIdAndUpdate( req.user._id, //  -------->>>>>>>>>>>>> é aqui q tenho de passar o Id do User  <<<<<<<<<<<<------------
        {
         userimage: userimage,
         username: username,
         email: email
      })
      .then(newImage => {
        res.status(200).json(newImage);
        // console.log(newImage)
      })
      .catch(err => next(err));

});





module.exports = router