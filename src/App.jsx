import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { API_URL } from "./shared";
import CreatePollForm from "./components/CreatePollForm";
import MyPolls from "./components/MyPolls";
import LivePolls from "./components/LivePolls";

import LivePoll from "./components/LivePoll";
import PollForm from "./components/PollForm";

import Results from "./components/Results";
import PollVotingPage from "./components/PollVotingPage";
import ShareableLinkPage from "./components/shareableLink";

const App = () => {
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch {
      console.log("Not authenticated");
      setUser(null);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Logout from our backend
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      nav("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="app">
        <Routes>
          <Route
            path="/CreatePollForm"
            element={<CreatePollForm user={user} />}
          />
          {/* <Route path="/LivePoll" element={<LivePoll />} /> */}
          <Route path="/LivePolls" element={<LivePolls />} />
          <Route path="/My Polls" element={<MyPolls />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/MyPolls" element={<MyPolls user={user} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/pollVotingPage/:slug" element={<PollVotingPage user={user} />} />
          <Route path="/results/:slug" element={<Results />} />
          <Route path="/share/:id" element={<ShareableLinkPage />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
