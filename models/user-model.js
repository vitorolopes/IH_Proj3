const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {
            type: String,
            required: true
          },

  password: {
            type: String,
            required: false  // mudei para false por causa do erro q dava no Social Login
          },
      
  email: {
          type: String,
          required: false   // false just for testing purposes on Postman 
  },

  userimage: {
          type: String,
          default: "https://static1.patasdacasa.com.br/articles/1/61/1/@/2271-o-bulldog-frances-e-um-companheiro-para-articles_media_mobile-2.jpg"
  }
}, 
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;