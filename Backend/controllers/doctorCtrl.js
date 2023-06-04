const doctorModel = require("../models/doctor");
const userModel = require("../models/user");
const appointmentModel = require("../models/appointment");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching Doctor Details",
    });
  }
};

//update doctor profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor profile update issue",
      error,
    });
  }
};

//get single doctor
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single info doctor fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in single doctor info",
      error,
    });
  }
};

//doctor appointments controller
const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({ doctorId: doctor._id });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments Fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doc Appointments",
    });
  }
};


//update status contorller
const updateStatusController = async(req,res)=>{
  try{
    const {appointmentsId,status} = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId,{status});
    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      type: "status updated",
      message: `Your appointment has been updated ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();  
    res.status(200).send({
      success:true,
      message:"Appointment status updated",
    }) 
  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error in updating the status",
      error
    })
  }
}

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};
