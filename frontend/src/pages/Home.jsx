import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList";
import { Pagination } from "antd";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [page, setPage] = useState(1);
  const numberOfDoctors = 5;

  //login user data
  const getUserData = async () => {
    try {
      const res = await axios.get("/api/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  console.log(doctors);
  return (
    <Layout>
      <h1 className="text-center">Home page</h1>
      <Row>
        {doctors &&
          doctors
            .map((doctor) => {
              if (currentUser && doctor.email == currentUser.email) {
                return null;
              } else {
                return <DoctorList doctor={doctor} />;
              }
            })
            .filter((x) => x)
            .slice((page - 1) * numberOfDoctors, page * numberOfDoctors)}
        
      </Row>
      <Pagination
        total={doctors.length}
        pageSize={numberOfDoctors}
        current={page}
        onChange={(val) => setPage(val)}
      />
    </Layout>
  );
};

export default Home;
