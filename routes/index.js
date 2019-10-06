var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user");

router.get("/",(req,res)=>{
	res.render("landing");
});

// ************* //
// SIGNUP ROUTES //
// ************* //

router.get("/register",(req,res)=>{
	res.render("register");
});

router.post("/register",(req,res)=>{
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
			console.log(err);
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		user.authenticate("local",(req,res,()=>{
			req.flash("success","welcome to yelpcamp "+user.username+"!");
			res.redirect("/campgrounds");
		}));
	});
});

// ************ //
// LOGIN ROUTES //
// ************ //

router.get("/login",(req,res)=>{
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}),(req,res)=>{
	console.log(err);
});

// ************* //
// LOGOUT ROUTES //
// ************* //

router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;
