import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import toggler_mode from "../assets/mode.jpg";

const Navbar = ({ theme, setTheme }) => {
  const toggle_mode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <div className="navbar block">
      <h1 className="flex text-2xl">EcoSmart</h1>

      <ul>
        <Link to="/">
          <li>Home</li>
        </Link>

        <Link to="/myRequests">
          <li>MyRequests</li>
        </Link>

        <Link to="#">
          <li>Notifications</li>
        </Link>

        <Link to="#">
          <li>Profile</li>
        </Link>
      </ul>

      <img
        onClick={toggle_mode}
        src={toggler_mode}
        alt="Toggle Theme"
        className="toggle-icon"
      />
    </div>
  );
};

export default Navbar;
