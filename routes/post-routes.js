const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Post = require('../models/post-model')
const { response } = require('../app')


// CREATE post route
router.post('/createpost', (req, res) => {
  const {title, description} = req.body

  if (!title || !description) {
    res.status(400).json({ message: 'Provide username, password and email' });
    return;
  }

  // console.log(req.session)
  Post.create(
    {
      title,
      description,
      postedBy: req.session.passport.user  // TO LINK A post TO THE user WHO CREATED IT
    }
  ).then( response =>{
     res.json(response);
  })
  .catch(err=>{
     res.json(error);
  })

});

// DELETE post route => to delete a specific post
router.delete('/deletepost/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 
  Post.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({ message: `Post with ${req.params.id} is removed successfully.` });
    })
    .catch(error => {
      res.json(error);
    });
});

// READ get route => to read all posts
router.get('/allpost', (req,res)=>{
  // gets data from mongoDB
  Post.find()
    .then(allPosts => {
      res.json(allPosts)
    }
    ).catch(err=>{
      // do something else
      res.json(err)
    })
})

//  UPDATE put (we could use patch as well) route => to update a specific post
router.put('/updatepost/:id', (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body)
      .then((response) => {
        console.log('response', response);
        res.json({ message: `Post ${response.title} was updated succesfully`});
      })
      .catch(error => {
        res.json(error);
      }) 
});

module.exports = router