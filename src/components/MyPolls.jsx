import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyPolls.css";
import { API_URL } from "../shared";

const MyPoll = () => {
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState("");

// fetching user polls using username and user_id 
  useEffect(() => {
    const fetchUserPolls = async () => {
      try {
        const userData = await axios.get(`${API_URL}/auth/me`, {withCredentials: true,});
        const username = userData.data.user?.username;
        if (!username) throw new Error("No username found");

        const findId = await axios.get(`${API_URL}/api/userId/${username}`, {withCredentials: true});
        const userId = findId.data.user_id;

        const findPolls = await axios.get(`${API_URL}/api/polls/user/${userId}`, {withCredentials: true});
        setPolls(findPolls.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your polls ❌");
      }
    };

    fetchUserPolls();
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
            <li key={poll.poll_id} className="poll-item">
              <h3>{poll.title}</h3>
              <p>{poll.description}</p>
              <p>
              </p>
              <ul className="option-list">
                {/* {pollOptions.map((option) => (
                  <li key={option.option_id} className="poll-option">
                    <h3>{option.option_text}</h3>
                  </li>
                  
                ))} */}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPoll;