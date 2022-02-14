const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv").config()
const {errorHandler} = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")


//Set the server port to 5000 unless specified in .env
const port = process.env.PORT || 5000

//connect to the database
connectDB()

//create express app
const app = express()

//parsers
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//routes app.use(route, require(path))
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/zoom/users", require("./routes/z_userRoutes"))

//middleware
app.use(errorHandler)

//run server
app.listen(port, () => console.log(`Server running on port: ${port}`.yellow))
