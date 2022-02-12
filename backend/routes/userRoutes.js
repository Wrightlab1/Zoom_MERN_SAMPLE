const express = require("express")
const router = express.Router()
const {registerUser, authenticateUser, getUser} = require("../controllers/userController")
const {protect} = require("../middleware/authMiddleware")

//routes

router.post("/", registerUser)

router.post("/login", authenticateUser)

router.get("/me", protect, getUser)

//export router
module.exports = router