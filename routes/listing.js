const express = require("express");
const router = express.Router();

const qwrapAsync = require("../utils/qwrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const{storage}  = require("../cloudConfig.js");
const upload = multer({ storage}); // Multer configuration

// Index and create route
router
  .route("/")
  .get(qwrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('image'),qwrapAsync(listingController.createListing));

// New route
router.get("/new", isLoggedIn, listingController.renderNewform);

// Delete, update, and show
router
  .route("/:id")
  .get(qwrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('image'),
    //validateListing
    qwrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, qwrapAsync(listingController.destroyListing));

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  qwrapAsync(listingController.renderEditForm)
);

module.exports = router;
