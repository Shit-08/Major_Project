const express= require('express');
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(savedRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true}), wrapAsync(userController.login));


router.get('/logout', userController.logout);

module.exports = router