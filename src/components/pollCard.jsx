import React, { useEffect, useState } from "react";
import "./pollCard.css";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import axios from "axios";

const PollCard = ({ title, description, id, expires_date, totalVotes }) => {
  const [poll, setPoll] = useState(null);
  const [pollOptions, setPollOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const pollRes = await axios.get(`${API_URL}/api/polls/poll/${id}`, {
          withCredentials: true,
        });
        const optionsRes = await axios.get(
          `${API_URL}/api/poll-options/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(pollRes);
        console.log(optionsRes);
        setPoll(pollRes.data);
        setPollOptions(optionsRes.data);
      } catch (err) {
        console.error("Failed to fetch poll data:", err);
      }
    };
    fetchPollData();
  }, [id]);

  if (!poll) return null;

  const handleEdit = () => {
    navigate("/CreatePollForm", {
      state: {
        title: poll.title,
        description: poll.description,
        publicPoll: poll.public,
        expirationDate: poll.expires_date,
        options: pollOptions.map((opt) => opt.option_text),
      },
    });
  };

  if (poll.status === "published") {
    return (
      <Link to={`/PollForm/${id}`} className="pollCardLink">
        <div className="pollContainer">
          <div className="info">
            <h3 id="title">{title}</h3>
            <p id="description">{description}</p>
            {expires_date && (
              <p className="expires">
                Expires: {new Date(expires_date).toLocaleString()}
              </p>
            )}
            <p className="votes">Total Votes: {totalVotes ?? 0}</p>
          </div>
        </div>
      </Link>
    );
  }

  if (poll.status === "draft") {
    return (
      <div className="pollContainer draft">
        <div className="info">
          <h3 id="title">{title}</h3>
          <p id="description">{description}</p>
          <p className="status-label">
            <strong>Draft</strong>
          </p>
        </div>
        <button onClick={handleEdit}>✏️ Edit</button>
      </div>
    );
  }

  return null;
};

export default PollCard;
