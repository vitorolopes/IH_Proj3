const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const User = require('../models/user-model')
const { response } = require('../app')

// CREATE post route
router.post('/updateuserimage', (req, res) => {
  const userimage = req.body
  
      User.findByIdAndUpdate(  //  -------->>>>>>>>>>>>> é aqui q tenho de passar o Id do User  <<<<<<<<<<<<------------
        {
         userimage: userimage
      })
      .then(newImage => {
        res.status(200).json(newImage);
        // console.log(newImage)
      })
      .catch(err => next(err));

});


router.post('/upload', uploadCloud.single("userimage"), (req, res, next) => {
  res.json({ userimage: req.file.secure_url });
})




module.exports = router