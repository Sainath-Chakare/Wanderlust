const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");
const {Schema} = mongoose;

let listingSchema = new Schema({
   title:{
      type: String,
      required: true
   },
   description:{
      type: String,
   },
   image:{
      filename:{
         type: String,
         default: "defaultfilename"
      },
      url:{
         type: String,
         default: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
         set: v => (v === "" ? "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v)
      }
   },
   price:{
      type: Number,
   },
   location:{
      type: String,
   },
   country: {
      type: String
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'
      }
   ],
   owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
   },
   geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
   if(listing.reviews.length){
      await Review.deleteMany({_id: {$in: listing.reviews}});
   }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;




























