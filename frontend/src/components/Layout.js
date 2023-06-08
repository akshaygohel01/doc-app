import React from "react";
import "../styles/Layout.css";
import { AdminMenu, UserMenu } from "../Data/data";
import { message, Badge } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  //Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully.");
    navigate("/login");
  };


  //********* doctor menu **********/
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house"
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list"
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user._id}`,
      icon: "fa-solid fa-user"
    },
  ]

  let SidebarMenu;
  if (user.isAdmin) {
    SidebarMenu = AdminMenu;
  }
  else if (user.isDoctor) {
    SidebarMenu = doctorMenu;
  }
  else {
    SidebarMenu = UserMenu;
  }

  const handleNav = () => {
    document.querySelector('.sidebar').classList.toggle('hidebar')
  }

  return (
    <>
      <div className="main">
        <div className="layout">

          <div className="ham-menu" onClick={handleNav}> <i class="fa-solid fa-bars"></i> </div>

          <div className="sidebar hidebar">
            <div className="logo">
              <h6>Doc App</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menu-item ${isActive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>


          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: "pointer" }}>
                <Badge
                  count={user && user.notification.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                  
                >
                  <i className="fa-solid fa-bell"></i>
                </Badge>
                <Link to="/profile">{user.name}</Link>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
