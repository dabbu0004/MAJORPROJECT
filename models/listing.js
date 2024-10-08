const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Assuming you have a Review model

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const ListingSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    country: String,
    location: String,
    image: ImageSchema,  // Expecting image with url and filename
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'  // Assuming the reviews are linked to the Listing
    }]
});

// Post middleware to delete associated reviews after a listing is deleted
ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        // Delete all reviews associated with the listing
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// Export the Listing model
// const Listing = mongoose.model('Listing', ListingSchema);
// module.exports = Listing;
module.exports = mongoose.model("Listing", ListingSchema);
