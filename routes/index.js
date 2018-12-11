var express    = require("express"),
    router     = express.Router(),
    passport   = require("passport"),
    User       = require("../models/user"),
    Campground = require("../models/campground");
    
// Root Route
router.get("/", function(req, res){
    res.render("landing");
});

// ================
// AUTH ROUTES
// ================

// Show register form
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

// Handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        email: req.body.email
    });
    if(req.body.adminCode === "classified123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
          console.log(err);
          return res.render("register", {error: err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login", {page: "login"});
});

// Handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: 'Welcome!',
    failureFlash: true
  }), function(req, res){
});

// Handle logout logic 
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You've been successfully loged out");
    res.redirect("/campgrounds");
});

// User profile
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("errror", "Something went wrong. Couldn't find user");
            return res.redirect("/");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("errror", "Something went wrong. Couldn't find campground");
                return res.redirect("/");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
    });
});


module.exports = router;

