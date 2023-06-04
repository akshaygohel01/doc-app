import React from "react";
import "../styles/Login.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import img1 from "../images/docimg1.jpg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      console.log(res);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };
  return (
    <>
      <div className="container">
        <div class="design">
          <img src={img1} alt="loading" />
          <p className="text-center m-3">Welcome Back😊</p>
        </div>
        <div className="login">
          <Form layout="vertical" onFinish={onfinishHandler} className="frm">
            <h3 className="title">Login Form</h3>
            <Form.Item label="Email" name="email">
              <Input type="email" className="text-input" required />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input type="password" className="text-input" required />
            </Form.Item>
            <Link to="/register" className="create">
              don't have an account register here.
            </Link>
            <button className="login-btn">Login</button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;

// import React from "react";
// import "../styles/Register.css";
// import { Form, Input, message } from "antd";
// import {useDispatch} from "react-redux";
// import { showLoading,hideLoading } from "../redux/features/alertSlice";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const Login = () => {

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   //form handler
//   const onfinishHandler = async(values) => {
//     try{
//       dispatch(showLoading());
//       const res = await axios.post('/api/user/login',values);
//       window.location.reload();
//       dispatch(hideLoading());
//       console.log(res);

//       if(res.data.success){
//         localStorage.setItem("token",res.data.token);
//         message.success("Login successfully");
//         navigate("/")
//       }else{
//         message.error(res.data.message);
//       }
//     }
//     catch(error){
//       dispatch(hideLoading());
//       console.log(error);
//       message.error('Something went wrong');
//     }
//   };
//   return (
//     <div className="form-container">
//       <Form
//         layout="vertical"
//         onFinish={onfinishHandler}
//         className="register-form"
//       >
//         <h3 className="text-center">Login Form</h3>
//         <Form.Item label="Email" name="email">
//           <Input type="email" required />
//         </Form.Item>
//         <Form.Item label="Password" name="password">
//           <Input type="password" required />
//         </Form.Item>
//         <Link to="/register" className="m-2">
//           don't have an account register here.
//         </Link>
//         <button className="btn btn-primary">Login</button>
//       </Form>
//     </div>
//   );
// };

// export default Login;
