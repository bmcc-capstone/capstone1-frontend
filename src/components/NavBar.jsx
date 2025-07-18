import React from "react";
import { Link } from "react-router-dom";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Capstone I</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            <span className="username">Welcome, {user.username}!</span>
            {/* <Link to={`/livepoll/${poll.poll_id}`}>View Live Poll</Link> */}

            <Link to="/CreatePollForm" className="nav-link">
              Create A Poll
            </Link>
            <Link to="/MyPolls" className="nav-link">
              My Polls
            </Link>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
        
          </div>
        ) : (
          <div className="auth-links">
            {/* <Link to={`/livepoll/${poll.poll_id}`}>View Live Poll</Link> */}

            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
