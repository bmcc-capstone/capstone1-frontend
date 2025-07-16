import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyPolls.css";

const MyPoll = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyPolls = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/polls/my-polls",
          { withCredentials: true }
        );

        setPolls(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your polls ❌");
      }
    };

    fetchMyPolls();
  }, []);

  return (
    <div className="mypoll-container">
      <h2>My Polls</h2>

      {error && <p className="error-message">{error}</p>}

      {polls.length === 0 && !error ? (
        <p>You haven't created any polls yet.</p>
      ) : (
        <ul className="poll-list">
          {polls.map((poll) => (
            <li key={poll.id} className="poll-item">
              <h3>{poll.title}</h3>
              <p>{poll.description}</p>
              <p>
                <strong>Options:</strong>
              </p>
              <ul className="option-list">
                {poll.options.map((opt, index) => (
                  <li key={index}>{opt.text}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPoll;
