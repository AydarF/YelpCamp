var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});

var options = {
 errorMessages: {
  IncorrectPasswordError: 'Password is incorrect',
  IncorrectUsernameError: 'Username is incorrect'
 }
};

UserSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", UserSchema);