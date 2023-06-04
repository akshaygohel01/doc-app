import React, { useState , useEffect} from 'react'
import Layout from '../components/Layout'
import axios from 'axios';
import moment from "moment";
import { Table } from 'antd';

const Appointments = () => {
    const [appointments,setAppointments] = useState([]);
    const [totalPages,setTotalPages] = useState(1);

    const getAppointments = async()=>{
      try{
        const res = await axios.get("/api/user/user-appointments",{
          headers:{
            Authorization : `Bearer ${localStorage.getItem("token")}`
          }
        });
        if(res.data.success){
                setAppointments(res.data.data);
                setTotalPages(Number(res.data.totalPages));
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
       getAppointments(); 
    },[])

    const columns = [
      {
        title: "ID",
        dataIndex: "_id",
      },
      // {
      //   title: "Name",
      //   dataIndex: "name",
      //   render: (text, record) => (
      //     <span>
      //       {record.doctorInfo.firstName} {record.doctorInfo.firstName}
      //     </span>
      //   ),
      // },
    //   {
    //     title: "Phone",
    //     dataIndex: "phone",
    //     render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    //   },
      {
        title: "Date & Time",
        dataIndex: "date",
        render: (text, record) => (
          <span>
            {moment(record.date).format("DD-MM-YYYY")} &nbsp;
            {moment(record.time).format("HH:mm")}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
      },
    ];

  return (
    <Layout>
      <h1>Appointments List</h1>
      <Table
        columns={columns}
        dataSource={appointments}
        pagination={{
          pageSize: 6,
          total: totalPages,
          total: appointments.length,
        }}
      />
    </Layout>
  );
}

export default Appointments
