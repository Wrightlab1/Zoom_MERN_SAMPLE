const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const {restart} = require("nodemon")
const res = require("express/lib/response")
const { json } = require("express/lib/response")
const API_Helper = require("../API_Helper")
const { response } = require("express")


// @desc GET A ZOOM USER
// @route POST /api/zoom/users/me
// @access PUBLIC


const z_getUser = asyncHandler(async(req,res) => {
  try {
    const {_id, name, email,zoomID} = await User.findById(req.user.id)
    url = `/users/${req.user.zoomID}`
    const sendRequest = API_Helper.make_API_call(url, "GET")
    //const user = z_getUser()
    sendRequest.then(function(result){
      let response = result
      res.status(200).json(response)
  })
  } catch (error) {
    res.status(401).json({error : "user does not exist"})
  }

})

// @desc UPDATE A USER IN ZOOM
// @route PATCH /api/zoom/users/me
// @access PUBLIC
const z_updateUser = asyncHandler(async(req,res) => {
  try {
    const {_id, name, email,zoomID} = await User.findById(req.user.id)
    const data = req.body
    url = `/users/${req.user.zoomID}`
    const sendRequest = API_Helper.make_API_call(url, "PATCH", data)
    sendRequest.then(function(result){
      let response = result
      res.status(200).json(response)
    })
  } catch (error) {
    res.status(400)
    console.log(error).json({error: error})
  }
})
module.exports = {z_getUser, z_updateUser}
