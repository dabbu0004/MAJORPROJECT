const express = require("express");
const router = express.Router({ mergeParams: true }); // Allows access to parent params (listing ID)
const mongoose = require("mongoose");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const qwrapAsync = require("../utils/qwrapAsync.js");
const ExpressError = require("../utils/ExprexError.js");
const {validateReview,isLoggedIn, isReviewAuthor} =require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");




// Post a new review
// router.post("/", isLoggedIn,validateReview, qwrapAsync(async (req, res) => {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new ExpressError(400, "Invalid listing ID");
//     }
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         throw new ExpressError(404, "Listing not found");
//     }
//     const review = new Review(req.body.review);
//     newReview.author =  req.user._id;
//     console.log(newReview);
//     listing.reviews.push(review);
//     await review.save();
//     await listing.save();
//     req.flash("success","New review Created!")
//     res.redirect(`/listings/${listing._id}`);
// }));

router.post("/", isLoggedIn, validateReview, qwrapAsync(reviewController.createReview));


// Delete a review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, qwrapAsync(reviewController.destroyReview));

module.exports = router;
