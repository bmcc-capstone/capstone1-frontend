import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../shared";
import "./LivePoll.css";

// Main component for displaying live public polls
const LivePolls = () => {
  // State for storing polls data
  const [polls, setPolls] = useState([]);
  // State for error messages
  const [error, setError] = useState("");
  // State for tracking number of users viewing each poll
  const [userCounts, setUserCounts] = useState({});
  // State for tracking which polls are expanded/collapsed
  const [expanded, setExpanded] = useState({});
  // State for showing/hiding the entire polls grid
  const [gridExpanded, setGridExpanded] = useState(true);

  // Fetch all live polls (public + not expired) when component mounts
  useEffect(() => {
    const fetchLivePolls = async () => {
      try {
        // API call to get live polls
        const response = await axios.get(`${API_URL}/api/polls/livepolls`);
        setPolls(response.data); // Store polls in state
      } catch (err) {
        console.error(err);
        setError("Failed to load live polls ❌"); // Set error message
      }
    };

    fetchLivePolls();
  }, []);

  // Fetch user counts for each poll, and update every 3 seconds
  useEffect(() => {
    const fetchUserCounts = async () => {
      const counts = {};

      // For each poll, fetch the number of users viewing it
      await Promise.all(
        polls.map(async (poll) => {
          try {
            const res = await axios.get(
              `${API_URL}/api/polls/${poll.poll_id}/users`
            );
            counts[poll.poll_id] = res.data.userCount;
          } catch (err) {
            console.error(`Error fetching users for poll ${poll.poll_id}`, err);
            counts[poll.poll_id] = 0; // Default to 0 on error
          }
        })
      );

      setUserCounts(counts); // Update state with user counts
    };

    // Only run if there are polls loaded
    if (polls.length > 0) {
      fetchUserCounts(); // Initial fetch
      const interval = setInterval(fetchUserCounts, 3000); // Poll every 3 seconds

      // Cleanup interval on unmount or polls change
      return () => clearInterval(interval);
    }
  }, [polls]);

  // Toggle expand/collapse for a single poll card
  const toggleExpand = (pollId) => {
    setExpanded((prev) => ({
      ...prev,
      [pollId]: !prev[pollId],
    }));
  };

  // Toggle expand/collapse for the entire polls grid
  const toggleGridExpand = () => setGridExpanded((prev) => !prev);

  // Show error message if API call fails
  if (error) {
    return <div className="livepoll-error">{error}</div>;
  }

  // Show loading message if no polls are found
  if (polls.length === 0) {
    return <div className="livepoll-loading">No active live polls found.</div>;
  }

  // polls grid with expand/collapse functionality
  return (
    <div className="livepoll-container">
      <h2>Live Public Polls</h2>
      {/* Button to show/hide all polls */}
      <button
        className="dropdown-btn"
        onClick={toggleGridExpand}
        style={{
          fontSize: "1.3rem",
          marginBottom: "1.5rem",
          background: "none",
          border: "none",
          color: "#4a2c09",
          cursor: "pointer",
          fontWeight: "bold",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {gridExpanded ? "Hide Polls ▲" : "Show Polls ▼"}
      </button>
      {/* Polls grid, only shown if gridExpanded is true */}
      {gridExpanded && (
        <div className="livepoll-cards-row">
          {/* Render each poll card */}
          {polls.map((poll) => (
            <div key={poll.poll_id} className="livepoll-card">
              {/* Button to expand/collapse poll details */}
              <button
                className="dropdown-btn"
                onClick={() => toggleExpand(poll.poll_id)}
                style={{
                  background: "none",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  color: "#4a2c09",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {/* Show poll title and arrow indicator */}
                {poll.title} {expanded[poll.poll_id] ? "▲" : "▼"}
              </button>
              {/* Poll details section, shown only if expanded */}
              <div className={expanded[poll.poll_id] ? "poll-details" : "poll-details poll-details-hidden"}>
                {expanded[poll.poll_id] && (
                  <>
                    {/* Poll description */}
                    <p>{poll.description}</p>
                    <div className="livepoll-info">
                      {/* Number of users viewing */}
                      <p>
                        <strong>Users viewing:</strong> {userCounts[poll.poll_id] || 0}
                      </p>
                      {/* Poll expiration date */}
                      <p>
                        <strong>Expires:</strong>{" "}
                        {new Date(poll.expires_date).toLocaleString()}
                      </p>
                    </div>
                    {/* Link to vote page for this poll */}
                    <Link to={`/livepolls/${poll.poll_id}`} className="vote-link">
                      Go to Vote Page
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LivePolls;
