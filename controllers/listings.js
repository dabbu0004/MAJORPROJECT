const Listing = require("../models/listing.js")
const mongoose = require("mongoose");
const ExpressError= require("../utils/ExprexError.js")
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  };
  module.exports.renderNewform = (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author", }, })
      .populate("owner");
    if (!listing) {
      req.flash("error", " Requested listings does not exist");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

 module.exports.createListing = async (req, res) => {
    // if (!req.file) { // Check if file was uploaded
    //     req.flash("error", "Image file is required");
    //     return res.redirect("/listings/new");
    // }
    
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

//  module.exports.createListing = async (req, res, next) => {
//     let url= req.file.path;
//     let filename=req.file.filename;
    
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image={url,filename};
//     await newListing.save();
//     req.flash("success", "New Listing Created"); // Flash success message only once
//     res.redirect("/listings");
//     next()
//   };
  

  module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash("error", "Invalid listing ID");
      return res.redirect("/listings");
    } 

    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Requested listing does not exist");
      return res.redirect("/listings"); // Added return to prevent further execution
    }
      let originalImageUrl = listing.image.url;
      // originalImageUrl.replace("/upload","/upload/w_0");
    res.render("listings/edit.ejs", { listing, originalImageUrl});
  };  

  module.exports.updateListing= async (req, res) => {
    const { id } = req.params;

    // Update the listing with new data from the request
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
      
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  };