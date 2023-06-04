const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userCtrl");
const authMiddlware = require("../middlewares/authMiddlware");

//router object
const router = express.Router();

//Register
router.post("/register",registerController);

//Login
router.post("/login",loginController);

//Auth
router.post("/getUserData",authMiddlware,authController);

//Apply Doctor
router.post("/apply-doctor", authMiddlware, applyDoctorController);

//Notification
router.post("/get-all-notification", authMiddlware, getAllNotificationController);
router.post("/delete-all-notification", authMiddlware,deleteAllNotificationController);

// GET ALL DOCTOR
router.get("/getAllDoctors",authMiddlware,getAllDoctorsController)

//BOOK APPOINTMENT
router.post("/book-appointment",authMiddlware,bookAppointmentController)

//BOOKING AVAILABILITY 
router.post("/booking-availability",authMiddlware,bookingAvailabilityController)

//APPOINTMENT LIST
router.get("/user-appointments",authMiddlware,userAppointmentsController)

module.exports = router;