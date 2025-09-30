const express= require('express');
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');

router.get("/signup", userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post("/login", savedRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true}), wrapAsync(userController.login));

router.get('/logout', userController.logout);

module.exports = router