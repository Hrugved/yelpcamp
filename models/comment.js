var mongoose = require("mongoose");
var moment = require("moment");

var commentSchema = mongoose.Schema({
	text : String,
	author : {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	time:Date
});

module.exports = mongoose.model("Comment", commentSchema);