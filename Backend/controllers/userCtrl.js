const userModel = require("../models/user");
const doctorModel = require("../models/doctor");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const appointmentModel = require("../models/appointment");
const moment = require("moment");

//register 
const registerController = async(req,res) => {
    try{
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({message:"user already exist",success:false})
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        req.body.password = hashedPassword;

        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(200).send({message:"Register successfully",success:true});
    }
    catch(err){
        console.log(err);
        res.status(500).send({success:false,message:`Register Controller ${err.message}`})
    }
} 

//login
const loginController = async(req,res) => {
    try{
        const user = await userModel.findOne({email:req.body.email});
        if(!user){
            return res.status(200).send({message:"user not found",success:false});
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch){
            return res.status(200).send({message:"invalid email or password",success:false});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.status(200).send({message:"Login Success",success:true,token});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:`Error in Login contorller ${err.message}`})
    }
} 

//Authentication
const authController = async(req,res) =>{
    try{
        const user = await userModel.findById({_id:req.body.userId});
        user.password = undefined;
        if(!user){
            return res.status(200).send({
                message:'user not found',
                success:false
            })
        }else{
            res.status(200).send({
                success:true,
                data:user 
            })
        }

    }
    catch(err){
        console.log(err);
        res.status(500).send({
            message:"auth error",
            success:false,
            err
        })
    }
}


// //Apply Doctor Controller
const applyDoctorController = async(req,res)=>{
    try{
        const newDoctor = await doctorModel({...req.body,status:"pending"})
        await newDoctor.save();

        const adminUser = await userModel.findOne({isAdmin:true});
        const notification = adminUser.notification;
        notification.push({
          type: "apply-doctor-request",
          message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account`,
          data:{
            doctorId:newDoctor._id,
            name:newDoctor.firstName + " " + newDoctor.lastName,
            onClickPath:'/admin/doctors'
          }
        });
        await userModel.findByIdAndUpdate(adminUser._id,{notification})
        res.status(201).send({
            success:true,
            message:"Doctor Account Applied Successfully"
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error While Applying For Doctor"
        })
    }
}


//Notification ctrl
const getAllNotificationController = async(req,res)=>{
    try{
        const user = await userModel.findOne({_id:req.body.userId});
        const seenNotification = user.seenNotification;
        const notification = user.notification;

        seenNotification.push(...notification);
        user.notification = []
        user.seenNotification = notification;
        
        const updatedUser = await user.save();
        res.status(200).send({
            success:true,
            message:"all notification marked as read",
            data:updatedUser,
        }) 
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            message:"Error in notification",
            success:false,
            error
        })
    }
}


//delete notification
const deleteAllNotificationController = async(req,res)=>{
    try{
        const user = await userModel.findOne({_id:req.body.userId});
        user.notification = [];
        user.seenNotification = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        res.status(200).send({
            success:true,
            message:"Notification deleted successfully",
            data:updatedUser
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
          message: "Unable to delete all notification",
          success: false,
          error,
        });
    
    }
}


//GET ALL DOCTOR 
const getAllDoctorsController =async(req,res)=>{
    try{
        const doctors = await doctorModel.find({status:"approved"});
        res.status(200).send({
            success:true,
            message:"Doctors List Fatched Successfully",
            data:doctors
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while fetching doctors",
            error
        })
    }
}

//BOOK APPOINTMENT
const bookAppointmentController = async(req,res)=>{
    try{
        req.body.date = moment(req.body.date,'DD-MM-YYYY').toISOString();
        req.body.time = moment(req.body.time,"HH:mm").toISOString();
        req.body.status = "pending";
        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();

        const user = await userModel.findOne({_id:req.body.doctorInfo.userId});
        user.notification.push({
            type:'New-appointment-request',
            message:`A New Appointment Request from ${req.body.userInfo.name}`,
            onClickPath: "/user/appointments"
        });
        await user.save();
        res.status(200).send({
            success:true,
            message:"Appointment Book Successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in book appointment",
            error
        })
    }
}


//BOOKING AVAILABILITY
const bookingAvailabilityController =async (req,res)=>{
    try{
        const date = moment(req.body.date,'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time,"HH:mm").subtract(1,"hours").toISOString()
        const toTime = moment(req.body.time,"HH:mm").add(1,"hours").toISOString()
        // const doctorId = res.body.doctorId;
        const appointments = await appointmentModel.find({
          doctorId:req.body.doctorId,
          date,
          time: {
            $gte: fromTime,
            $lte: toTime,
          },
        });
        if(appointments.length > 0){
            return res.status(200).send({
                message:"Appointment not available at this time",
                success:false
            })
        }
        else{
            return res.status(200).send({
              success: true,
              message: "Appoinments available",
            });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            message:"Error in Booking",
            success:false,
            error
        })
    }
}


//USER APPOINTMENTS
const userAppointmentsController = async(req,res)=>{
    try{
        const appointments = await appointmentModel.find({userId:req.body.userId});
        res.status(200).send({
            success:true,
            message:"Users Appointments Fetched Successfully.",
            data:appointments
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            message:"Error in user appointments",
            success:false,
            error
        })
    }
}

module.exports = {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};