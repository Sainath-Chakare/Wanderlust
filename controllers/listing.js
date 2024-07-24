const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.allListing = async(req,res)=>{
   let listings = await Listing.find({});
   res.render("./listings/main.ejs",{listings});
}

module.exports.createNewList = (req,res)=>{
   res.render("./listings/new.ejs");
}

module.exports.addNewList = async(req,res,next)=>{

   let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
   })
   .send()

   let url = req.file.path;
   let filename = req.file.filename;
   let {listing} = req.body;
   let newListing = await Listing(listing);
   newListing.owner = req.user._id; // Adding user name in listing
   newListing.image = {url,filename};
   newListing.geometry = response.body.features[0].geometry
   await newListing.save();
   req.flash("success","New Listing has been added!");
   res.redirect("/listings");
}

module.exports.viewList = async(req,res)=>{
   let {id} = req.params;
   let listing = await Listing.findById(id).populate({
      path:"reviews",
      populate:{
         path: "author"
      }
   }).populate("owner");

   if(!listing){
      req.flash("error","No Listing Exist!");
      res.redirect("/listings");
   }
   res.render("./listings/view.ejs",{listing});
}

module.exports.editList = async(req,res)=>{
   let {id} = req.params;
   let listing = await Listing.findById(id);
   if(!listing){
      req.flash("error","No Listing Exist!");
      res.redirect("/listings");
   }
   // let originalImageUrl = listing.image.url;
   // originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250,e_blur:300");
   res.render("./listings/edit.ejs",{listing});
}

module.exports.updateList = async(req,res,next)=>{
   let {id} = req.params;
   let {listing} = req.body;
   let updateListing = await Listing.findByIdAndUpdate(id,listing);

   if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      updateListing.image = {url,filename};
      await updateListing.save();
   }
   req.flash("success","Listing has been updated!");
   res.redirect(`/listings/${id}`);
}

module.exports.destroyList = async(req,res)=>{
   let {id} = req.params;
   let listing = await Listing.findByIdAndDelete(id);
   console.log(listing);
   req.flash("success","Listing has been deleted!");
   res.redirect("/listings");
}


























