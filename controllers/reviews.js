const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const mongoose = require("mongoose");
module.exports. createReview=async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    const review = new Review(req.body.review); // 'review' should be the correct variable
    review.author = req.user._id; // Changed 'newReview' to 'review'
    console.log(review); // Logging the correct variable

    listing.reviews.push(review);
    await review.save();
    await listing.save();

    req.flash("success", "New review Created!");
    res.redirect(`/listings/${listing._id}`);
};
 module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ExpressError(400, "Invalid listing or review ID");
    }
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/${id}`);
};