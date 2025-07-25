import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import "./PollVotingPage.css";

const PollVotingPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]); // array of option_ids
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

  // Toggle option select/deselect
  const handleOptionChange = (optionId) => {
    setError("");
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0) {
      setError("Please select at least one option before voting.");
      return;
    }

    // Prepare votes with ranks in the order user selected
    const votesPayload = selectedOptions.map((option_id, idx) => ({
      option_id,
      rank: idx + 1,
    }));

    try {
      await axios.post(`${API_URL}/api/ballots/vote`, {
        poll_id: pollId,
        votes: votesPayload,
        // user_id: currentUserId, // add if you have user auth
      });

      setMessage("Thank you for voting! 🎉");
      setError("");

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
      <div className="poll-vote-header">
        <div className="vote-label">Vote</div>
        <div className="poll-title-main">{poll.title}</div>
        <div className="poll-header-divider"></div>
        <p className="poll-description">{poll.description}</p>
      </div>

      <div className="poll-options">
        {poll.pollOptions && poll.pollOptions.length > 0 ? (


          poll.pollOptions.map((option) => {
            const selectedIdx = selectedOptions.indexOf(option.option_id);
            //For each option, this checks if it’s selected and finds its position in the array(Selectedoptions).
            //If the option is selected, it returns its index (0 for first, 1 for second, etc.).
            //If not selected, it returns -1
            return (
              <label key={option.option_id} className={`poll-option${selectedIdx !== -1 ? " stomp" : ""}`}>
                {selectedIdx !== -1 && (
                  <span className="option-rank-badge">{selectedIdx + 1}</span>
                )}
                <input
                  type="checkbox"
                  name="pollOption"
                  value={option.option_id}
                  checked={selectedOptions.includes(option.option_id)}
                  onChange={() => handleOptionChange(option.option_id)}
                />
                {option.option_text}
              </label>
            );
          })


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
