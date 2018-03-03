var express =require("express");
var router = express("router");
var middleware = require("../middleware/index");
var Photo = require("../models/photo");
var User = require("../models/user");
// INDEX ROUTE
router.get("/", function(req, res) {
    res.redirect("/photos");
});

router.get("/photos", function(req, res) {
    Photo.find({}, function(err, foundPhotos) {
        if(err || !foundPhotos) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("photos/index", {photos: foundPhotos});
        }
    })
});

router.get("/:userId/photos", function(req, res){
    User.findById(req.params.userId).populate(
        {
            path: "photos",
            model: "Photo" 
        }
    ).exec(function(err, foundUser) {
        if(err || !foundUser) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("photos/index", {photos: foundUser.photos});
        }
    })
});

// NEW ROUTE
router.get("/:userId/photos/new", middleware.isLoggedIn, function(req, res){
    res.render("photos/new");
})

// CREATE ROUTE
router.post("/:userId/photos", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.userId, function(err, foundUser) {
        if(err || !foundUser) {
            req.flash("error", err.message);
            res.redirect("/" + req.params.userId + "/photos");
        } else {
            Photo.create(req.body.photo, function(err, newPhoto) {
                if(err || !newphoto) {
                    req.flash("error", err.message);
                    res.render("photos/new");
                } else {
                    // redirect to index
                    newPhoto.author.id = foundUser._id;
                    newPhoto.author.username = foundUser.username;
                    newPhoto.save();
                    foundUser.photos.push(newPhoto._id);
                    foundUser.save();
                    res.redirect("/"+ req.params.userId + "/photos");
                }
            });        
        }
    });
})

// SHOW ROUTE
router.get("/:userId/photos/:photoId", function(req, res) {
    Photo.findById(req.params.photoId, function(err, foundPhoto){
        if(err || !foundPhoto) {
            req.flash("error", err.message);
            res.redirect("/photos");
        } else {
            res.render("photos/show", {photo: foundPhoto});
        }
    })
});

// EDIT ROUTE
router.get("/:userId/photos/:photoId/edit", middleware.isLoggedIn, function(req, res){
    Photo.findById(req.params.photoId, function(err, foundPhoto){
        if(err || !foundPhoto){
            req.flash("error", err.message);
            res.redirect("/photos");
        } else {
            res.render("photos/edit", { photo: foundPhoto});
        }
    })
});

// UPDATE ROUTE
router.put("/:userId/photos/:photoId", middleware.isLoggedIn, function(req, res){
    Photo.findByIdAndUpdate(req.params.photoId, req.body.photo, function(err, updatedPhoto) {
        if(err || !updatedPhoto) {
            req.flash("error", err.message);
            res.redirect("/" + req.params.userId + "/photos");
        } else {
            res.redirect("/" + req.params.userId + "/photos/" + req.params.id);
        }
    })
});

// DELETE ROUTE
router.delete("/:userId/photos/:photoId", middleware.isLoggedIn, function(req, res){
    // destroy photo
    Photo.findByIdAndRemove(req.params.photoId, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/" + req.params.userId + "/photos");
        } else {
            res.redirect("/" + req.params.userId + "/photos");
        }
    })
});

module.exports = router;