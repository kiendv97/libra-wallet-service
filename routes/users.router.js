var express = require('express');
var router = express.Router();
const userService = require('../services');

/* GET users listing. */
router.post('/signup', userService.signup)
router.post('/signin', userService.signin)

module.exports = router;
