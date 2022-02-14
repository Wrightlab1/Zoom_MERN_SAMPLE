var express = require('express')
const mongoose = require('mongoose')
const querystring = require('querystring')
const api_helper = require('../API_Helper')
var router = express.Router()
const bodyParser = require('body-parser');
const {z_getUsers, z_getUser, z_updateUser, z_deleteUser} = require("../controllers/z_userController")
const {protect} = require("../middleware/authMiddleware")




router.use(bodyParser.json({ extended: true }));

//define the users route

//routes

//router.get("/", protect, z_getUsers)

router.patch("/me", protect, z_updateUser)

router.get("/me", protect, z_getUser)



module.exports = router;