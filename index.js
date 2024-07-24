if(process.env.NODE_ENV != "production"){
   require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./routes/user.js");
const MongoStore = require('connect-mongo');

let DBUrl = process.env.ATLAS_URL;
async function main(){
   await mongoose.connect(DBUrl);
}

main().then(()=>console.log("Connected to DB")).catch((err)=>console.log(err));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(cookieParser("secretcode"));

app.listen(8080,()=>{console.log("Listening on Port 8080")});

const store = MongoStore.create({
   mongoUrl: DBUrl,
   crypto: {
      secret: process.env.SECRET,
   },
   touchAfter: 24 * 3600
})

store.on("error",(err)=>{
   console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
   store,
   secret:process.env.SECRET,
   resave:false,
   saveUninitialized: true,
   cookie:{
      expires: Date.now() +  7 * 24 * 60 * 60 * 1000,
      maxAge:  7 * 24 * 60 * 60 * 1000,
      httpOnly: true
   }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Middleware
app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.curUser = req.user;
   console.log("Current User:", req.user);  
   next();
})

// Getting listings and reviews Routes
app.use("/listings",listing);
app.use("/listings/:id/review",reviews);
app.use("/",user);

// Base Route
app.all("*",(req,res)=>{
   throw new ExpressError(404,"Invalid Page! Requested Page does not exists.");
})

// Custom Error Handling MW
app.use((err,req,res,next)=>{
   let {status=500,message="Some error"} = err;
   res.status(status).render("error.ejs",{message});
   // res.status(status).send(message);
})
























