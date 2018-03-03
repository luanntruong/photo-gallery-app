var express = require("express"),
    router  = express("router"),
    passport = require("passport"),
    User = require("../models/user");

// REGISTER ROUTE
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        }
    );
    
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.firstName);
           res.redirect("/photos"); 
        });
    });
});

// LOGIN ROUTE
router.get("/login", function(req, res) {
    res.render("login", {error: req.flash("error")});
})

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/photos",
        failureRedirect: "/login",
        failureFlash: "Invalid username or password",
        successFlash: 'Welcome back'
    }), function(req, res){
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "See you later!");
    res.redirect("/photos");
 });
 
module.exports = router;