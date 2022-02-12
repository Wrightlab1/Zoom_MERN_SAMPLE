const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const {restart} = require("nodemon")
const res = require("express/lib/response")
const { json } = require("express/lib/response")

// @desc Register a new User
// @route POST /api/users
// @access PUBLIC

const registerUser = asyncHandler(async(req,res) => {
  const {name, email, password} = req.body
  //check if body has all fields
  if(!name || !email || !password) {
    res.status(400)
    throw new Error("INCLUDE ALL REQUIRED FIELDS : name, email, password")
  }
  //check if the user already exists
  const userExists = await User.findOne({email})

  if (userExists) {
    res.status(400)
    throw new Error(`A user with the email ${email} already exists`)
  }

  //hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  //create the User
  
  const user = await User.create({
    name,
    email,
    password : hashedPassword,
    zoomID : createZoomUser(email)
  })

  

  //respond if user created successfully
  if (user) {
    res.status(201).json({
      _id : user.id,
      name : user.name,
      email : user.email,
      zoomID: user.zoomID,
      token : generateToken(user._id)
    })
  } else {
      res.status(400)
      throw new Error("INVALID USER DATA")
    }
})

// @desc Authenticate a User
// @route api/users/login
// access PUBLIC

const authenticateUser = asyncHandler(async(req,res) => {
  const {email, password} = req.body

  //get user from db by email address
  const user = await User.findOne({email})

  // check the password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id : user.id,
      name : user.name,
      email : user.email,
      token : generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error("Incorrect email address or password")
  }
})

// @dec Get a users data
// @route /api/users/me
// @access PRIVATE
const getUser = asyncHandler(async(req,res) => {
  const {_id, name, email} = await User.findById(req.user.id)
  res.status(200).json({
    id: _id,
    name,
    email
  })
})

//generate JWT
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, { expiration : "30d"})
}

//create Zoom User
const createZoomUser = (email) => {
  url = "https://api.zoom.us/v2/users/"
  data = {
    email:email,
    type : process.env.ZOOM_USER_TYPE
  }
  return new Promise((resolve, reject) => {
    const req = https.request(url, makeCallback(resolve, reject))
    req.on("error", reject)
    req.write(data)
    req.end
  })
}

//export user functions
module.exports = {registerUser, authenticateUser, getUser}
