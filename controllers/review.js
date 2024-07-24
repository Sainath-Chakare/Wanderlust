const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.postReview = async(req,res)=>{
   let {id} = req.params;
   let listing = await Listing.findById(id);

   let {review} = req.body;
   let review1 = new Review(review);
   review1.author = res.locals.curUser._id;
   
   listing.reviews.push(review1);
   await review1.save();
   await listing.save();
   req.flash("success","New Review has been added!");
   res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req,res)=>{
   let {id, reviewid} = req.params;
   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
   await Review.findByIdAndDelete(reviewid);
   req.flash("success","Review has been deleted!");
   res.redirect(`/listings/${id}`);
}