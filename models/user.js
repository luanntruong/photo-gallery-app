var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    photos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            Ref: "Photo"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);