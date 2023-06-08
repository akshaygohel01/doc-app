import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { DatePicker, TimePicker, message } from "antd";
import dayjs from "dayjs";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();

  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailabel, setIsAvailable] = useState(false);

  //login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/doctor/getDoctorById",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //====== handle availability ======//
  const handleAvailability = async () => {
    try {
      // dispatch(showLoading());
      const res = await axios.post(
        "/api/user/booking-availability",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // dispatch(hideLoading());
      setIsAvailable(res.data.success);
      console.log(res.data);
      if (res.data.success) {
        // setIsAvailable(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      // dispatch(hideLoading());
      console.log(error);
    }
  };


  // ========= BOOKING FUNCTION =========//
  const handleBooking = async () => {
    try {
      // setIsAvailable(true);
      if(!date && !time){
        return alert("Date and Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          date: date,
          userInfo: user,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // console.log(doctors);
  return (
    <Layout>
      <h3 className="m-3">Booking Page</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees:{doctors.feesPerConsultation}</h4>
            {doctors.timings && (
              <h4>
                {/* Timings:{doctors.timings[0]}-{doctors.timings[1]} */}
                Timings:{doctors.timings && doctors.timings[0]}-
                {doctors.timings && doctors.timings[1]}
              </h4>
            )}
            <div className="d-flex flex-column w-50">
              <DatePicker
                aria-required={"true"}
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  // setIsAvailable(true);
                  setDate(dayjs(value).format("DD-MM-YYYY"));
                }}
              />

              <TimePicker
                aria-required={"true"}
                className="mt-2"
                format="HH:mm"
                onChange={(value) => {
                  // setIsAvailable(true);
                  setTime(dayjs(value).format("HH:mm"));
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>
              {isAvailabel ? (
                <button className="btn btn-dark mt-2" onClick={handleBooking}>
                  Book Now
                </button>
              ) : (null)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
