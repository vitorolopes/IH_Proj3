const mongoose = require ('mongoose')
const Schema = mongoose.Schema


const postSchema = new Schema ({
   title: {
     type: String,
     required: true
    },

   description: {
     type: String,
     required: true
    },

   postedBy: {
     type: Schema.Types.ObjectId, 
     ref:"User"
   },

   photo:{
    type:String,
    default: "https://media-cdn.tripadvisor.com/media/photo-s/01/03/ae/d7/cascada-del-limon.jpg"
}

},{timestamps:true})

const Post = mongoose.model('Post', postSchema)
module.exports = Post