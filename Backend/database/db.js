const mongoose = require("mongoose");

const mongoconn = mongoose
  .connect("mongodb://localhost:27017/Doc-app")
  .then(() => console.log("Connection created"))
  .catch((err) => console.log(err));


module.exports = mongoconn;