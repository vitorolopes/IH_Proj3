const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Post = require('../models/post-model')
const User = require('../models/user-model')
const { response } = require('../app')

const uploadCloud = require('../configs/cloudinary.js'); // --------->>>>>>>>>>>>>>


// CREATE post route
router.post('/createpost', (req, res) => {
  const {title, description, imageUrl} = req.body
  // const imageUrl = req.file.secure_url
  // Validation
  if (!title || !description || !imageUrl) {
    res.status(400).json({ message: 'Provide title, description and image' });
    return;
  }
  //
  console.log("hey Post.create route")
  // console.log(req)
   console.log(req.session)
  // console.log(req.session.passport.user)
   console.log("User", req.user)
  
  // console.log(req.user._id)
  // console.log("Passport", req._passport.user)

      Post.create(
        {title, 
        description, 
        imageUrl,
        // postedBy: req.session.passport.user  // TO LINK A post TO THE user WHO CREATED IT
         postedBy: req.user._id  // TO LINK A post TO THE user WHO CREATED IT
      })
      .then(newImage => {
        res.status(200).json(newImage);
        // console.log(newImage)
      })
      .catch(err => next(err));

});


router.post('/upload', uploadCloud.single("imageUrl"), (req, res, next) => {
  res.json({ imageUrl: req.file.secure_url });
})


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
router.get('/allposts', (req,res)=>{
  // gets data from mongoDB
  Post.find()
    // .populate("postedBy")
    .populate("postedBy", "_id username userimage")
    .then(allPosts => {
      res.json(allPosts)
    }
    ).catch(err=>{
      // do something else
      res.json(err)
    })
})


//! get the post to update it ------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get('/posts/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    res.status(400).json({message: 'id is not valid'})
    return
  }
  Post.findById(req.params.id)
      .then((post) => {
        console.log('response from router.get(/posts/:id', post);
        res.json(post)
      })
      .catch(error => {
        res.json(error);
      }) 
});

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

// READ get route => to read all posts from the current (logged) user
router.get('/ownposts', (req, res) => {
  // console.log("hey")
  // console.log(req.session)
  // console.log("User", req.user)
  // console.log("User id", req.user._id)
  // console.log("Passport", req.session.passport.user)
  Post.find(
    {
      postedBy: req.user._id
    })
  .populate("postedBy", "_id username")
  .then(posts => {
    res.json(posts)
  }).catch(err=>{
    res.json(err)
  })
});



router.put('/likepost/:id', (req, res) => {
  console.log("Id do Post", req.params.id)
  console.log("Id do User", req.user)
  console.log( req.session)

Post.findById(req.params.id)
.then((response) => {
    if (response.likes.includes(req.user.id)) {
      console.log("You have already liked this post")
    } else {
      Post.findByIdAndUpdate (req.params.id, {
        $push:{likes: req.user._id}})
        .then((response) => {
        console.log(response)
      // res.json(response)
    })
    .catch(error => {
      res.json(error);
    }) 
}})
})

router.put('/unlikepost/:id', (req, res) => {
  console.log("Id do Post", req.params.id)
  console.log("Id do User", req.user)
  console.log( req.session)

Post.findById(req.params.id)
.then((response) => {
    // if (response.unlikes.includes(req.user.id)) {
    //   console.log("You have already unliked this post")
    // } else {
      Post.findByIdAndUpdate (req.params.id, {
        $pull:{likes: req.user._id}})
        .then((response) => {
        console.log(response)
      // res.json(response)
    })
    .catch(error => {
      res.json(error);
    }) 
// }  ultima chaveta do IF    
})
})

router.get('/otherusersprofile/:id', (req, res, next) => {
  User.findById( req.params.id)
  .then(personalDetails => {
    res.json(personalDetails);
  })
  .catch(err=>{
  res.json(err)
})
});


router.get('/otherusersposts/:id', (req, res, next) => {
        Post.find(
          {
            postedBy: req.params.id
          }
        )
        .then(postsFromOtherUser => {
          res.json(postsFromOtherUser)
        })
        .catch(err=>{
        res.json(err)
      })
});





module.exports = router

















