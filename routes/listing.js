const express= require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing= require("../models/listing");
const {isLoggedIn, isOwner, validateListing} = require("../middleware");
const listingController = require("../controllers/listings");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

//Index and create route
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.create));;

//New Route
router.get('/new', isLoggedIn, listingController.new);

//Show Route, update route and delete route
router.route('/:id')
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

//Edit Route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports= router;