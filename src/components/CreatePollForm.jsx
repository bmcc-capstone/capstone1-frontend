import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "./CreatePollForm.css";
import { useNavigate } from "react-router-dom";
import ShareableLinkPage from "./shareableUrl";

const CreatePollForm = ({}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [publicPoll, setPublicPoll] = useState(false);
  const [message, setMessage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const nav = useNavigate();

  const handleSave = async () => {
    const payload = {
      title,
      description,
      publicPoll,
      expirationDate,
      status: "draft",
    };
    try {
      const response = await axios.post(`${API_URL}/api/polls/`, payload, {
        withCredentials: true,
      });
      const poll_id = response.data.poll_id;

      options.map(async (option) => {
        await axios.post(
          `${API_URL}/api/poll-options/`,
          {
            option_text: option,
            poll_id: poll_id,
          },

          { withCredentials: true }
        );
      });
    } catch (error) {
      console.error("Failed to save as draft:", error);
    }
    nav("/MyPolls");
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [user_id, setUserId] = useState("");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
    }
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    console.log(options);
    setShowConfirm(false);

    try {
      const payload = {
        title,
        description,
        public: publicPoll,
        expires_date: expirationDate,
        status: "published",
      };

      if (options.length < 2) {
        setMessage("Please provide at least 2 options ❗");
        return;
      }
      try {
        const response = await axios.post(
          `${API_URL}/api/polls/${user_id}`,
          payload,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        const poll_id = response.data.poll.poll_id;
        console.log(poll_id);
        options.map(async (option) => {
          await axios.post(
            `${API_URL}/api/poll-options/`,
            {
              option_text: option,
              poll_id: poll_id,
            },

            { withCredentials: true }
          );
        });
      } catch (error) {
        console.error("Failed to Publish Poll:", error);
      }
      nav("/");

      setMessage("Vote Poll Created Successfully ✅");
      handleResetConfirmed();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to create vote poll ❌");
    }
    nav("/MyPolls");
  };

  const handleResetConfirmed = () => {
    setShowResetConfirm(false);
    setTitle("");
    setDescription("");
    setOptions(["", ""]);
    setPublicPoll(false);
    setExpirationDate("");
    setMessage("");
    setShowConfirm(false);
  };

  useEffect(() => {
    const fetchUserPolls = async () => {
      try {
        const userData = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });
        const username = userData.data.user?.username;
        if (!username) throw new Error("No username found");

        const findId = await axios.get(`${API_URL}/api/userId/${username}`, {
          withCredentials: true,
        });
        const userId = findId.data.user_id;
        console.log("User ID:", userId);
        setUserId(userId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserPolls();
  }, []);

  return (
    <div className="create-vote-poll-container">
      <h2>Create a Vote Poll</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleOpenConfirm}>
        <label>Poll Title:</label>
        <input
          type="text"
          value={title}
          placeholder="Enter poll title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Poll Description (optional):</label>
        <textarea
          value={description}
          placeholder="Enter poll description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="options-container">
          <label>Options:</label>
          {options.map((opt, index) => (
            <div key={index} className="option-item">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              {options.length > 2 && (
                <button type="button" onClick={() => removeOption(index)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption}>
            ➕ Add Option
          </button>
        </div>

        <label>Expiration Date & Time (Mandatory):</label>
        <input
          type="datetime-local"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />

        <div className="public-poll-checkbox">
          <input
            type="checkbox"
            checked={publicPoll}
            onChange={(e) => setPublicPoll(e.target.checked)}
          />
          <label>Allow guests (unauthorized users) to vote</label>
        </div>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="submit">Publish Poll</button>

        <button type="button" onClick={() => setShowResetConfirm(true)}>
          Reset Form
        </button>
      </form>

      {/* Confirmation Modal — Submit */}
      {showConfirm && (
        <div className="poll-confirm-modal">
          <div className="modal-content">
            <h3>🎉 Ready to submit?</h3>
            <p>Make sure everything looks good — this poll will go live!</p>
            <div className="modal-actions">
              <button onClick={handleSubmit}>✅ Confirm</button>
              <button onClick={() => setShowConfirm(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal — Reset */}
      {showResetConfirm && (
        <div className="poll-confirm-modal">
          <div className="modal-content">
            <h3>🧹 Clear everything?</h3>
            <p>This will remove all form data and start fresh. Proceed?</p>
            <div className="modal-actions">
              <button onClick={handleResetConfirmed}>✅ Reset</button>
              <button onClick={() => setShowResetConfirm(false)}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePollForm;
