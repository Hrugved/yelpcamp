var express = require("express"),
	router = express.Router({mergeParams:true}),
	Campground = require("../models/campgrounds.js"),
	Comment = require("../models/comment.js"),
	middlewareObj = require("../middleware");

router.get("/new",middlewareObj.isloggedIn, (req,res)=>{
	Campground.findById(req.params.id,(err,foundCamp)=>{
		if(err) { console.log(err);}
		else {res.render("comments/new",{camp:foundCamp});}
	});
});
		
router.post("/",(req,res)=>{
	Campground.findById(req.params.id,(err,foundCamp)=>{
		if(err) {console.log(err);}
		else {
			Comment.create(req.body.comment,(err,Createdcomment)=>{
				if(err) {console.log(err);}
				else { 
					Createdcomment.author.id = req.user._id;
					Createdcomment.author.username = req.user.username;
					console.log("date:   "+Date.now());
					Createdcomment.time = Date.now();
					console.log("time:  "+Createdcomment.time);
					Createdcomment.save();
					foundCamp.comments.push(Createdcomment);
					foundCamp.save();
					req.flash("success","Thanks "+req.user.username+", for your review");
					
					res.redirect("/campgrounds/" + foundCamp._id);
				}
			});
		}
	});
}); 

//EDIT
router.get("/:comment_id/edit",middlewareObj.checkCommentOwnership,(req,res)=>{
	Comment.findById(req.params.comment_id,(err,foundComment)=>{
		if(err) { console.log(err); return res.redirect("back");}
		res.render("comments/edit",{comment:foundComment,camp_id:req.params.id});
	});
});

//UPDATE
router.put("/:comment_id",middlewareObj.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
		if(err) { console.log(err); return res.redirect("back");}
		res.redirect("/campgrounds/"+req.params.id);
	});
});

//DELETE
router.delete("/:comment_id",middlewareObj.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err) { console.log(err); return res.redirect("back");}
		res.redirect("/campgrounds/"+req.params.id);
	});
});

module.exports = router;