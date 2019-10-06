var Campground = require("../models/campgrounds"),
	Comment = require("../models/comment"),
	middlewareObj = {};

middlewareObj.checkCampOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,(err,foundCamp)=>{
		if(err) {
			req.flash("Sorry! Campground not found");
			return res.redirect("back");}
		if(foundCamp.author.id.equals(req.user._id)) {next();}
			else{
				req.flash("Sorry "+req.user.username+"! You don`t have permission to do that!");
				res.redirect("back");}
	});}
	else{
		req.flash("error","You need to be Logged In first");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err) {return res.redirect("back");}
		if(foundComment.author.id.equals(req.user._id)) {next();}
			else{
				req.flash("Sorry "+req.user.username+"! You don`t have permission to do that!");
				res.redirect("back");
			}
	});}
	else{
		req.flash("error","You need to be Logged In first");
		res.redirect("back");
	}
};

middlewareObj.isloggedIn = function(req,res,next){ 
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be Logged In first");
	res.redirect("/login");
};

module.exports = middlewareObj;