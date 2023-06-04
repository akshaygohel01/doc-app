import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";
import dayjs from "dayjs";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [timings, setTimings] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //update doc
  const handleFinish = async (values) => {
    console.log(values.timings);
    let myTiming = [
      timings[0]["$d"].toString().substr(16, 5),
      timings[1]["$d"].toString().substr(16, 5),
    ];
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/doctor/updateProfile",
        {
          ...values,
          userId: user._id,
          timings: myTiming,
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
        navigate("/");
      } else {
        message.error(res.data.success);
      }
    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
      message.error("Something Went Wrong");
    }
  };

  //getDoc details
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "/api/doctor/getDoctorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        let time = res.data.data.timings;
        time = [dayjs(time[0], "HH:mm"), dayjs(time[1], "HH:mm")];
        setTimings(time);
        setDoctor(res.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      console.log("Something Went Wrong");
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, []);

  return (
    <Layout>
      <h1>Manage Profile</h1>
      {doctor && (
        <>
          <Form
            layout="vertical"
            onFinish={handleFinish}
            className="m-3"
            initialValues={{
              ...doctor,
              // timings: [
              //   moment(doctor.timings[0],"HH:mm"),
              //   moment(doctor.timings[1],"HH:mm"),
              // ],
            }}
          >
            <h4>Personal Details:</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Last Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Phone number"
                  name="phone"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Email"
                  name="email"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Your Email" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Website" name="website">
                  <Input type="text" placeholder="website" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Address"
                  name="address"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Your Address" />
                </Form.Item>
              </Col>
            </Row>
            <h4>Professional Details:</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Specialization"
                  name="specialization"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Specialization" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="Experience"
                  name="experience"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="Experience" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  label="FeesPerConsultation"
                  name="feesPerConsultation"
                  required
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="feesPerConsultation" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <TimePicker.RangePicker
                  order={false}
                  value={timings}
                  onChange={(val) => {
                    console.log(val);
                    setTimings(val);
                  }}
                  format="HH:mm"
                />
              </Col>
              <Col xs={24} md={24} lg={8}></Col>
              <Col xs={24} md={24} lg={8}>
                <button className="btn btn-primary form-btn" type="submit">
                  Update
                </button>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </Layout>
  );
};

export default Profile;
