const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const storage = require("../cloudConfig.js");
const upload = multer(storage);

router.route("/")
   .get(wrapAsync(listingController.allListing))
   .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.addNewList));

// Create List
router.get("/new",isLoggedIn,listingController.createNewList);

router.route("/:id")
   .get(wrapAsync(listingController.viewList))
   .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateList))
   .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyList));

// Edit Individual List
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editList));

module.exports = router;







































