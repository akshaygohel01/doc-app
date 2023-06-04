import React from "react";
import "../styles/Register.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/user/register", values);
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Registered successfully");
        navigate("/login");
        console.log(res.data);
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
      message.error("something went wrong");
    }
  };
  return (
    <div className="container">
      <div className="design">
        <i class="fa-solid fa-user-doctor-message"></i>
        <h6 className="content">
          Welcome to our doctor appointment system, where convenience meets
          excellence in health care. Book appointments and prioritize your
          well-being with our user-friendly platform.
        </h6>
      </div>
      <div className="">
        <Form
          layout="vertical"
          onFinish={onfinishHandler}
          // className="register-form"
          className="register"
        >
          <h3 className="text-center">Register Form</h3>
          <Form.Item label="Name" name="name" className="frm-itm">
            <Input type="text" className="text-input" required />
          </Form.Item>
          <Form.Item label="Email" name="email" className="frm-itm">
            <Input type="email" className="text-input" required />
          </Form.Item>
          <Form.Item label="Password" name="password" className="frm-itm">
            <Input type="password" className="text-input" required />
          </Form.Item>
          <Link to="/login" className="create">
            Already have an account
          </Link>
          <button className="register-btn">Register</button>
        </Form>
      </div>
    </div>
  );
};

export default Register;

// import React from "react";
// import { Form, Input, message } from "antd";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { showLoading, hideLoading } from "../redux/features/alertSlice";
// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

// const Register = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   //form handler
//   const onfinishHandler = async (values) => {
//     try {
//       dispatch(showLoading());
//       const res = await axios.post("/api/user/register", values);
//       dispatch(hideLoading());

//       if (res.data.success) {
//         message.success("Registered successfully");
//         navigate("/login");
//         console.log(res.data);
//       } else {
//         message.error(res.data.message);
//       }
//     } catch (err) {
//       dispatch(hideLoading());
//       console.log(err);
//       message.error("something went wrong");
//     }
//   };
//   return (
//     <div className="form-container">
//       <Form
//         layout="vertical"
//         onFinish={onfinishHandler}
//         className="register-form"
//       >
//         <h3 className="text-center">Register Form</h3>
//         <Form.Item label="Name" name="name">
//           <Input type="text" required />
//         </Form.Item>
//         <Form.Item label="Email" name="email">
//           <Input type="email" required />
//         </Form.Item>
//         <Form.Item label="Password" name="password">
//           <Input type="password" required />
//         </Form.Item>
//         <Link to="/login" className="m-2">
//           Already have an account
//         </Link>
//         <button className="btn btn-primary">Register</button>
//       </Form>
//     </div>
//   );
// };

// export default Register;
