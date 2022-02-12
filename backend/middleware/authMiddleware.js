const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel.js")
const request = require("request")

const protect = asyncHandler(async(req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try {
      //get token from header
      token = req.headers.authorization.split(" ")[1]

      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      //get user from the token
      req.user = await User.findById(decoded.id).select("-password")

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error("NOT AUTHORIZED")
    }
  }if (!token) {
    res.status(401)
    throw new Error("NOT AUTHORIZED : NO TOKEN")
  }
})


//export middleware
module.exports = {protect}