const express = require('express');

const router = express.Router();

const {register} = require('../controllers/user.controller');

router.use('/register',register);


module.exports = register;