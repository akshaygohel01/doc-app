const express = require("express")
const morgan = require("morgan")
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

//dotenv config
dotenv.config();

//mongodb connection
connectDB();

const port = process.env.PORT || 8080;

const app = express()

//middlewares
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/user",require("./routes/userRoute"));
app.use("/api/admin",require("./routes/adminRoute"));
app.use("/api/doctor",require("./routes/doctorRoute"));

//static files
app.use(express.static(path.join(__dirname,'frontend','build')))

app.use('*',async(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","build","index.html"));
})

//listening to the port 
app.listen(port,()=>{
    console.log(`listening to port number ${process.env.port}`)
})