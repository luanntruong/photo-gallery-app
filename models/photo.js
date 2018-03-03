var mongoose = require("mongoose");

// MONGOOSE/MODEL CONFIG
var photoSchema = new mongoose.Schema({
    title: String,
    image: String,
    created: {type: Date, default: Date. now},
    author : {
        id: {
            type: mongoose.Schema.Types.ObjectId
        },
        username: String
    }
});

module.exports = mongoose.model("Photo", photoSchema);