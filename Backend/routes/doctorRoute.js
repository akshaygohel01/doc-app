const express = require("express");
const router = express.Router();
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorCtrl");
const  authMiddlware = require("../middlewares/authMiddlware");

//POST SINGLE DOCTOR INFO
router.post("/getDoctorInfo",authMiddlware,getDoctorInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile",authMiddlware,updateProfileController);

//GET SINGLE DOCTOR INFO
router.post("/getDoctorById", authMiddlware, getDoctorByIdController);

//GET APPOINTMENTS
router.get("/doctor-appointments",authMiddlware,doctorAppointmentsController)

//POST UPDATE STATUS
router.post("/update-status",authMiddlware,updateStatusController);

module.exports = router;