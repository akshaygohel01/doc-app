// const express = require("express");
// const router = express.Router;
const router = require("express").Router(); 
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddlware");


// //GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// //GET METHOD || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//POST ACCOUNT STATUS
router.post("/changeAccountStatus",authMiddleware,changeAccountStatusController);

module.exports = router;
