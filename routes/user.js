const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
   .get(userController.getSignup)
   .post(wrapAsync(userController.postSignup));

router.route("/login")
   .get(userController.getLogin)
   .post(saveRedirectUrl,
      passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}),
      userController.postLogin
   )

router.get("/logout",userController.logout);

module.exports = router;