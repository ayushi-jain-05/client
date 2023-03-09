import React from "react"
import { useNavigate} from "react-router-dom";
import styles from "./styles.module.css";
import { googleLogout } from "@react-oauth/google";
import  {Dropdown}  from "react-bootstrap";
import "../../App.css";
const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
      googleLogout();
      localStorage.clear();
    navigate("/login");
  };
  return (
    <div className={styles.App}>
      <div className={styles.nav}>
  <nav className="navbar navbar-expand-md navbar-light bg-light">
    <a className="navbar-brand" href="#">User Details</a>
    <span>
    <Dropdown className="d-md-none">
      <Dropdown.Toggle variant="success" id="dropdown-basic"  data-toggle="collapse" data-target="#navbarNav" className="navbar-toggler">
        Menu
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="/" onClick={logout}>Log Out</Dropdown.Item>
        <Dropdown.Item href="/data/profile"> Details</Dropdown.Item>
        <Dropdown.Item href="/profile">Edit Profile</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </span>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
        <li className="nav-item">
          <a className="nav-link" href="/" onClick={logout}>Log Out</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/data/profile">Users Details</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/profile">Edit Details</a>
        </li>
      </ul>
    </div>
  </nav>
  </div>
</div>
  )
}

export default Navbar
