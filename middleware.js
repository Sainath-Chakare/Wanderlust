const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

// Validate ServerSide Listing
module.exports.validateListing = (req,res,next) =>{
   let {error} = listingSchema.validate(req.body);
   if(error) throw new ExpressError(400,error);
   else next();
}

// Validate ServerSide Review
module.exports.validateReview = (req,res,next) =>{
   let {error} = reviewSchema.validate(req.body);
   if(error) throw new ExpressError(400,error);
   else next();
}

module.exports.isLoggedIn = (req,res,next)=>{
   if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      req.flash("error","You must be logged in to create Listing");
      return res.redirect("/login");
   }
   next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
   if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
}

module.exports.isOwner = async(req,res,next) =>{
   let {id} = req.params;
   let listingowner = await Listing.findById(id);
   const curUser = res.locals.curUser; 
   if(curUser && !(listingowner.owner._id.equals(curUser._id))){
      req.flash("error","You need to be owner to perform this action.");
      return res.redirect(`/listings/${id}`);
   }
   next();
}


module.exports.isReviewAuthor = async(req,res,next) =>{
   let {id,reviewid} = req.params;
   let review = await Review.findById(reviewid);
   const curUser = res.locals.curUser; 
   if(curUser && !(review.author._id.equals(curUser._id))){
      req.flash("error","You need to be author of this review.");
      return res.redirect(`/listings/${id}`);
   }
   next();
}