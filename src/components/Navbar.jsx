import React from 'react';
import './Navbar.css';

const Navbar = ({ onOpenBooking }) => {
  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <div className="logo">
          Web<span>Karigor</span>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#about">About</a>
        </div>
        <button className="btn-primary" onClick={onOpenBooking}>Book a call</button>
      </div>
    </nav>
  );
};

export default Navbar;
