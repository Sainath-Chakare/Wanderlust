const Joi = require('joi');

module.exports.listingSchema = Joi.object({
   listing: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      country: Joi.string().required(),
      location: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.object({
         filename: Joi.string().allow("",null).default("listingname"),
         url: Joi.string().allow("",null).default("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
      })
   }).required()
});


module.exports.reviewSchema = Joi.object({
   review: Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().required()
   }).required()
})









