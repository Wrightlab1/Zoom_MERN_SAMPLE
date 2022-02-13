const express = require("express")
const router = express.Router()
const {registerUser, authenticateUser, getUser, deleteUser} = require("../controllers/userController")
const {protect} = require("../middleware/authMiddleware")

//routes

router.post("/", registerUser)

router.post("/login", authenticateUser)

router.get("/me", protect, getUser)

router.delete("/me", protect, deleteUser)

//export router
module.exports = router