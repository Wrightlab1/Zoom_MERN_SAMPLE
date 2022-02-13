const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const {restart} = require("nodemon")
const res = require("express/lib/response")
const { json } = require("express/lib/response")
const API_Helper = require("../API_Helper")
const { response } = require("express")

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
    password : hashedPassword
  })

  //Create the user in Zoom
  const createZoomUser =  () => {
    url = "/users/"
    first_name = user.name.split(" ")[0]
    last_name = user.name.split(" ")[1]
    data = {action : process.env.ZOOM_USERCREATE_ACTION, user_info : {email : `${user.id}@${process.env.ZOOM_DOMAIN}`, type : process.env.ZOOM_USER_TYPE, first_name : first_name, last_name : last_name}}
    return API_Helper.make_API_call(url, "POST", data)
    }

  const zoomUser = createZoomUser(
    console.log("here")
  )
  zoomUser.then(function(result){
    zoomUserID =  result.id
    //respond if user created successfully
  if (user) {
    res.status(201).json({
      _id : user.id,
      name : user.name,
      email : user.email,
      zoomID : zoomUserID,
      token : generateToken(user._id)
    })
  } else {
      res.status(400)
      throw new Error("INVALID USER DATA")
    }
})
  })
/*
  //respond if user created successfully
  if (user) {
    res.status(201).json({
      _id : user.id,
      name : user.name,
      email : user.email,
      zoomID : zoomUserID,
      token : generateToken(user._id)
    })
  } else {
      res.status(400)
      throw new Error("INVALID USER DATA")
    }
})
*/
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
  try {
    const {_id, name, email} = await User.findById(req.user.id)
  res.status(200).json({
   id: _id,
   name,
   email
 })
  } catch (error) {
    res.status(401).json({error : "user does not exist"})
  }
  
  
})

// @desc Delete a User
// route DELETE /api/users/:id
// @access PRIVATE
const deleteUser = asyncHandler(async(req, res) => {
  const {_id, name, email} = await User.remove({id : req.user.id})
  res.status(200).json({ message : "user deleted"})
  
})

//generate JWT
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn : "30d"})
  
}

      
//export user functions
module.exports = {registerUser, authenticateUser, getUser, deleteUser}
