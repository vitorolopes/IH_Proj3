const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {
            type: String,
            required: true
          },

  password: {
            type: String,
            required: true
          },
      
  email: {
          type: String,
          required: false   // false just for testing purposes on Postman 
  },

  userimage: {
          type: String,
          default: "https://images-na.ssl-images-amazon.com/images/I/61s09WHmZ-L.jpg"
  }
}, 
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;