var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"), 
	Campground = require("./models/campgrounds"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	User = require("./models/user"),
	commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	moment = require("moment");

// seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// *************** //
// PASSPORT CONFIG //
// *************** //

app.use(require("express-session")({
	secret:"sbafbasobsaldivbsaubfa",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.flashError = req.flash("error");
	res.locals.flashSuccess = req.flash("success");
	res.locals.moment = moment;
	next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3001,process.env.IP,()=>{
	console.log("YelpCamp is up and running!");
});