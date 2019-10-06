var express = require("express"),
	router = express.Router(),
	Campground = require("../models/campgrounds.js"),
	Comment = require("../models/comment.js"),
	middlewareObj = require("../middleware");

router.get("/",(req,res)=>{
	Campground.find({},(err,allCamps)=>{
		if(err) {console.log(err);}
		else { res.render("campgrounds/index", {camps:allCamps, currentUser:req.user}); }	
	});
});

router.post("/",middlewareObj.isloggedIn,(req,res)=>{
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username : req.user.username
	};
	var newCampground = {name : name, price:price, image : image, description : desc, author:author };
	Campground.create(
	newCampground,
	(err,newlyCreated)=>{
		if(err) {
			req.flash("error","Sorry for the inconvenience but there appears to be an error! Please try again later.");	
			console.log(err);
		}else {
		req.flash("success","Thanks "+newlyCreated.author.username+"! Successfully created "+newlyCreated.name);	
		res.redirect("/campgrounds");}
	}
	);	
});

router.get("/new",middlewareObj.isloggedIn,(req,res)=>{
	res.render("campgrounds/new");
});

router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,foundCamp)=>{
		if(err) { console.log(err);}
		else { res.render("campgrounds/show",{camp:foundCamp});}
	});
});

//Edit
router.get("/:id/edit",middlewareObj.checkCampOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCamp)=>{
		res.render("campgrounds/edit",{camp:foundCamp});
	});
});

//UPDATE
router.put("/:id",middlewareObj.checkCampOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.camp,(err,UpdatedCamp)=>{
		if(err) {
			console.log(err); 
			req.flash("error","Sorry for the inconvenience but there appears to be an error! Please try again later.");	
			return res.redirect("/campgrounds");}
		req.flash("success","Successfully updated campground!");
		res.redirect("/campgrounds/"+req.params.id);
	});
});

//DELETE
router.delete("/:id",middlewareObj.checkCampOwnership,(req,res)=>{
	Campground.findByIdAndRemove(req.params.id,(err,deleted)=>{
		if(err) {
			console.log(err);
			req.flash("error","Sorry for the inconvenience but there appears to be an error! Please try again later.");		 
			return res.redirect("/campgrounds");}
		req.flash("success","Successfully deleted campground!");
		res.redirect("/campgrounds");
	});
});

module.exports = router;