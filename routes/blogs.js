var express =require("express");
var router = express("router");
var middleware = require("../middleware/index");

// INDEX ROUTE
router.get("/", function(req, res) {
    res.redirect("/blogs");
});

router.get("/blogs", function(req, res) {
    Blog.find({}, function(err, foundBlogs) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("index", {blogs: foundBlogs});
        }
    })
});

router.get("/:userId/blogs", function(req, res){
    User.findById(req.params.userId).populate(
        {
            path: "blogs",
            model: "Blog" 
        }
    ).exec(function(err, foundUser) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("blogs/index", {user: foundUser});
        }
    })
});

// NEW ROUTE
router.get("/:userId/blogs/new", middleware.isLoggedIn, function(req, res){
    res.render("blogs/new");
})

// CREATE ROUTE
router.post("/:userId/blogs", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.userId, function(err, foundUser) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/" + req.params.userId + "/blogs");
        } else {
            req.body.blog.body = req.sanitize(req.body.blog.body);
            Blog.create(req.body.blog, function(err, newBlog) {
                if(err) {
                    req.flash("error", err.message);
                    res.render("blogs/new");
                } else {
                    // redirect to index
                    newBlog.author.id = foundUser._id;
                    newBlog.author.username = foundUser.username;
                    newBlog.save();
                    foundUser.blogs.push(newBlog._id);
                    foundUser.save();
                    res.redirect("/"+ req.params.userId + "/blogs");
                }
            });        
        }
    });
})

// SHOW ROUTE
router.get("/:userId/blogs/:blogId", middleware.isLoggedIn, function(req, res) {
    Blog.findById(req.params.blogId, function(err, foundBlog){
        if(err) {
            req.flash("error", err.message);
            res.redirect("/blogs");
        } else {
            res.render("blogs/show", {blog: foundBlog});
        }
    })
});

// EDIT ROUTE
router.get("/:userId/blogs/:blogId/edit", middleware.isLoggedIn, function(req, res){
    Blog.findById(req.params.blogId, function(err, foundBlog){
        if(err){
            req.flash("error", err.message);
            res.redirect("/blogs");
        } else {
            res.render("blogs/edit", { blog: foundBlog});
        }
    })
});

// UPDATE ROUTE
router.put("/:userId/blogs/:blogId", middleware.isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.blogId, req.body.blog, function(err, updatedBlog) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/" + req.params.userId + "/blogs");
        } else {
            res.redirect("/" + req.params.userId + "/blogs/" + req.params.id);
        }
    })
});

// DELETE ROUTE
router.delete("/blogs/:id", middleware.isLoggedIn, function(req, res){
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/" + req.params.userId + "/blogs");
        } else {
            res.redirect("/" + req.params.userId + "/blogs");
        }
    })
});

module.exports = router;