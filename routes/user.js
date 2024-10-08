const express = require("express");
const router = express.Router();
const User =  require("../models/user.js");
const qwrapAsync =  require("../utils/qwrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/users.js");
const { saveRedirectUrl } = require("../middleware.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post(qwrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post( saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),    
userController.login
);



//    router.get("logout",(req,res,next)=>{
//     req.logout((err)=>{
//         if(err){
//             return next(err);

//         }
//         req.flash("success","you are logged out!")
//         res.redirect("/listings");
//     });
//    });
// Corrected logout route
router.get("/logout",userController.logout);


module.exports = router;
