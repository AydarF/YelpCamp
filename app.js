require('dotenv').config();

var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),   
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    seedDB                = require("./seeds");
    
// Requiring Routes    
var campgroundsRoutes = require("./routes/campgrounds"),
    commentRoutes     = require("./routes/comments"),
    indexRoutes       = require("./routes/index");
    
    
mongoose.connect("mongodb://localhost:27017/yelp_camp_v13_dynamic_price", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// seedDB();

// PASSPORT CONFIG

app.use(require("express-session")({
    secret: "The earth is still a sphere!",
    resave: false,
    saveUninitialized: false
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To be able to use the same user on all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get("*", function(req, res){
    res.send("The page doesn't exist yet. You may as well just create it!");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The server is running...");
});


