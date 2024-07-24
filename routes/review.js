const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Reviews Routes
// Post Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

// Delete Review Route
router.delete("/:reviewid",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;