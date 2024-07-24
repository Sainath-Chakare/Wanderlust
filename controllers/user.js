const User = require("../models/user.js");

module.exports.getSignup = (req,res)=>{
   res.render("./users/signup.ejs");
}

module.exports.postSignup = async(req,res)=>{
   try{
      let {username,email,password} = req.body;
      let newUser = new User({email,username});
      let registeredUser = await User.register(newUser,password);
      req.login(registeredUser, (err)=>{
         if(err) return next(err);
         else{
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
         }
      })
   }catch(err){
      req.flash("error",err.message);
      res.redirect("/signup");
   }
}

module.exports.getLogin = (req,res)=>{
   res.render("./users/login.ejs");
}

module.exports.postLogin = async(req,res) =>{
   req.flash("success","Welcome back to WanderLust!");
   let redirectUrl = res.locals.redirectUrl;
   if(redirectUrl) res.redirect(redirectUrl);
   else res.redirect("/listings");
}

module.exports.logout = (req,res,next)=>{
   req.logout((err)=>{
      if(err) return next(err);
      else{
         req.flash("success","You have been logged Out!");
         res.redirect("/listings");
      }
   })
}




















