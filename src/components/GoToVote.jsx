import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./GoToVote.css";

const GoToVote = ({ user }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const fetchUserPolls = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/polls/user/${user.user_id}`, {
          withCredentials: true,
        });
        setPolls(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load polls");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPolls();
  }, [user]);

  if (loading) return <div>Loading your polls...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="goto-vote-container">
      <h2>Your Polls — Go Vote!</h2>
      {polls.length === 0 ? (
        <p>You haven't created any polls yet.</p>
      ) : (
        <ul className="poll-list">
          {polls.map((poll) => {
            // Check if the poll is expired
            const isExpired = new Date(poll.expires_date) < new Date();
            return (
              <li key={poll.poll_id} className="poll-item">
                {isExpired ? (
                  // If expired, show as gray text and disable link
                  <span style={{ color: "gray", cursor: "not-allowed" }}>
                    <strong>{poll.title}</strong> — Expired on{" "}
                    {new Date(poll.expires_date).toLocaleString()}
                  </span>
                ) : (
                  <Link to={`/livepolls/${poll.poll_id}`}>
                    <strong>{poll.title}</strong> — Expires on{" "}
                    {new Date(poll.expires_date).toLocaleString()}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GoToVote;
