import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./PollVotingPage.css";

const PollVotingPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/polls/poll/${pollId}`);
        setPoll(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load poll ❌");
      }
    };

    fetchPoll();
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption) {
      setError("Please select an option before voting.");
      return;
    }
    console.log("Submitting vote for poll:", pollId);
    console.log("Selected option:", selectedOption);
    try {
      await axios.post(`${API_URL}/api/ballots/vote`, {
        poll_id: pollId,
        option_id: selectedOption,
      });

      setMessage("Thank you for voting! 🎉");
      setError("");

      // Redirect back to LivePolls after vote
      setTimeout(() => navigate("/LivePolls"), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit vote ❌");
    }
  };

  if (error) return <div className="poll-vote-error">{error}</div>;
  if (!poll) return <div className="poll-vote-loading">Loading poll...</div>;
  if (message) return <div className="poll-vote-message">{message}</div>;

  return (
    <div className="poll-vote-container">
      <h2>Vote: {poll.title}</h2>
      <p>{poll.description}</p>

      <div className="poll-options">
        {poll.pollOptions && poll.pollOptions.length > 0 ? (
          poll.pollOptions.map((option) => (
            <label key={option.option_id} className="poll-option">
              <input
                type="radio"
                name="pollOption"
                value={option.option_id}
                onChange={() => setSelectedOption(option.option_id)}
              />
              {option.option_text}
            </label>
          ))
        ) : (
          <p>No options available for this poll.</p>
        )}
      </div>

      <button onClick={handleVote} className="vote-button">
        Submit Vote
      </button>
    </div>
  );
};

export default PollVotingPage;