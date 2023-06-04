const express = require("express")
const colors = require("colors")
const morgan = require("morgan")
const dotenv = require("dotenv");


//dotenv config
dotenv.config();

//mongodb connection
const mongoconn = require("./database/db")

const port = process.env.PORT || 8080;

const app = express()

//middlewares
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/user",require("./routes/userRoute"));
app.use("/api/admin",require("./routes/adminRoute"));
app.use("/api/doctor",require("./routes/doctorRoute"));

//listening to the port 
app.listen(port,()=>{
    console.log(`listening to port number ${process.env.port}`)
})