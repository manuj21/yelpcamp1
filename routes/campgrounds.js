var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

var middleware = require("../middleware");

//INDEX-route which show all campgrounds
router.get("/",function(req,res){

	//get all campgrounds from database
	Campground.find({}, function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
             res.render("index",{campgrounds:allcampgrounds});
		}
	});
	
});
//CREATE -add new campgrounds to the database
router.post("/", middleware.isLoggedIn, function(req,res){


	//get data from form and add to campgrounds array.
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newcampground = {name:name , image:image , price: price, description:desc, author:author}
	//create a new campground save to the database
    Campground.create(newcampground, function(err,newlyCreated){
    	if(err){
    		console.log(err);
    	}else{
       //redirect back to campground page
	      res.redirect("/campgrounds");
    	}
    });     
	
});

//NEW-route show the form where we add new campgrounds
router.get("/new", middleware.isLoggedIn, function(req,res){ 

	res.render("new.ejs");


});
//SHOW-route shows more info about one campground
router.get("/:id", function(req,res){
	//find the campground with the provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
             //render show template with that camprground
	          res.render("show", {campground: foundCampground});
		}
	});
	
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
		Campground.findById(req.params.id, function(err,foundCampground){
			res.render("edit", {campground: foundCampground});
		});
});
//UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
		
	});
});



module.exports = router;