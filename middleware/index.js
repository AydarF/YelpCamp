var Campground = require("../models/campground"),
    Comment    = require("../models/comment");
    
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Oops, couldn't find a campground or the database is not connected!");
            res.redirect("back");
        } else {
            // Does user own the campground?
            if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else {
                req.flash("error", "You dont have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else {
        req.flash("error", "You have to be logged in!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Oops, couldn't find a comment or the database is not connected!");
            res.redirect("back");
        } else {
            // Does user own the comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else {
                req.flash("error", "You dont have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("back");
    }
};

// Authorize the user
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to perform that action!");
    res.redirect("/login");
};

module.exports = middlewareObj;
