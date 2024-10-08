const Listing = require("./models/listing");
const ExpressError = require("./utils/ExprexError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You are not the owner of the listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err); // Handle errors
    }
};

// Validate the listing data
module.exports.validateListing = (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError("Listing data is required", 400);
    }
  
    // Validation using Joi schema
    const { error } = listingSchema.validate(req.body.listing);
    if (error) {
      const msg = error.details.map(el => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    next();
  };

// module.exports.validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body.listing);
//     if (error) {
//       const msg = error.details.map(el => el.message).join(',');
//       throw new ExpressError(msg, 400);
//     }
//     next();
//   };

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};



module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (err) {
        next(err); // Handle errors
    }
};
