import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../shared";
import "./LivePoll.css";

const LivePolls = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");
  const [userCounts, setUserCounts] = useState({});

  // Fetch all live polls (public + not expired)
  useEffect(() => {
    const fetchLivePolls = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/polls/livepolls`);
        setPolls(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load live polls ❌");
      }
    };

    fetchLivePolls();
  }, []);

  // Fetch user counts for each poll (optional)
  useEffect(() => {
    const fetchUserCounts = async () => {
      const counts = {};

      await Promise.all(
        polls.map(async (poll) => {
          try {
            const res = await axios.get(
              `${API_URL}/api/polls/${poll.poll_id}/users`
            );
            counts[poll.poll_id] = res.data.userCount;
          } catch (err) {
            console.error(`Error fetching users for poll ${poll.poll_id}`, err);
            counts[poll.poll_id] = 0;
          }
        })
      );

      setUserCounts(counts);
    };

    if (polls.length > 0) {
      fetchUserCounts();
      const interval = setInterval(fetchUserCounts, 3000);

      return () => clearInterval(interval);
    }
  }, [polls]);

  if (error) {
    return <div className="livepoll-error">{error}</div>;
  }

  if (polls.length === 0) {
    return <div className="livepoll-loading">No active live polls found.</div>;
  }

  return (
    <div className="livepoll-container">
      <h2>Live Public Polls</h2>

      {polls.map((poll) => (
        <div key={poll.poll_id} className="livepoll-card">
          <h3>{poll.title}</h3>
          <p>{poll.description}</p>

          <div className="livepoll-info">
            <p>
              <strong>Users viewing:</strong> {userCounts[poll.poll_id] || 0}
            </p>
            <p>
              <strong>Expires:</strong>{" "}
              {new Date(poll.expires_date).toLocaleString()}
            </p>
          </div>

          {/* Use React Router Link for SPA navigation */}
          <Link to={`/livepolls/${poll.poll_id}`} className="vote-link">
            Go to Vote Page
          </Link>
        </div>
      ))}
    </div>
  );
};

export default LivePolls;
