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
   imageUrl: { 
     type: String, 
     required: true },
     
//    photo:{
//     type:String,
//     default: "https://media-cdn.tripadvisor.com/media/photo-s/01/03/ae/d7/cascada-del-limon.jpg"
// }

   likes:[{type: Schema.Types.ObjectId,ref:"User"}],
  //  unlikes:[{type: Schema.Types.ObjectId,ref:"User"}]
},{timestamps:true})

const Post = mongoose.model('Post', postSchema)
module.exports = Post