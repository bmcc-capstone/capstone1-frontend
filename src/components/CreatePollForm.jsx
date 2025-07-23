import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";
import "./CreatePollForm.css";
import { useNavigate, useLocation } from "react-router-dom";

const CreatePollForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([]);
  const [publicPoll, setPublicPoll] = useState(false);
  const [message, setMessage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [user_id, setUserId] = useState("");
  const [pollId, setPollId] = useState(null);
  const nav = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    if (location.state) {
      setTitle(location.state.title || "");
      setDescription(location.state.description || "");
      setPublicPoll(
        location.state.publicPoll === true ||
          location.state.publicPoll === "true"
      );
      const rawDate = location.state.expirationDate || new Date();
      setExpirationDate(formatForDatetimeLocal(rawDate));
      setOptions(
        (location.state.options || ["", ""]).map((text) => ({
          option_text: text,
        }))
      );
      setPollId(location.state.poll_id);
    }
  }, [location.state]);

  const formatForDatetimeLocal = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const pad = (n) => String(n).padStart(2, "0");

    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const HH = pad(date.getHours());
    const mm = pad(date.getMinutes());

    return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
  };

  const handleSave = async () => {
    const parsedDate = new Date(expirationDate);
    const formattedDate = parsedDate.toISOString();
    console.log(expirationDate);
    const payload = {
      title,
      description,
      public: publicPoll,
      expires_date: formattedDate,
      status: "draft",
    };
    for (let e in payload) {
      console.log(e, typeof e);
    }

    try {
      if (pollId) {
        const response = await axios.patch(
          `${API_URL}/api/polls/${pollId}`,
          payload,
          {
            withCredentials: true,
          }
        );

        const optionsRes = await axios.get(
          `${API_URL}/api/poll-options/${pollId}`,
          {
            withCredentials: true,
          }
        );

        const existingOptions = optionsRes.data;

        await Promise.all(
          existingOptions.map((option, index) => {
            const newOpt = options[index];
            return axios.patch(
              `${API_URL}/api/poll-options/${option.option_id}`,
              {
                option_text: newOpt.option_text,
              },
              { withCredentials: true }
            );
          })
        );
      } else {
        const response = await axios.post(
          `${API_URL}/api/polls/${user_id}`,
          payload,
          {
            withCredentials: true,
          }
        );
        const newPollId = response.data.poll_id;
        setPollId(newPollId);
        await Promise.all(
          options.map(async (option) => {
            await axios.post(
              `${API_URL}/api/poll-options/`,
              {
                option_text: option.option_text,
                poll_id: newPollId,
              },

              { withCredentials: true }
            );
          })
        );
      }
    } catch (error) {
      console.error("Failed to save as draft:", error);
    }
    nav("/MyPolls");
  };

  const handleSubmit = async () => {
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
      if (pollId) {
        const response = await axios.patch(
          `${API_URL}/api/polls/${pollId}`,
          payload,
          {
            withCredentials: true,
          }
        );

        const optionsRes = await axios.get(
          `${API_URL}/api/poll-options/${pollId}`,
          {
            withCredentials: true,
          }
        );

        const existingOptions = optionsRes.data;

        await Promise.all(
          existingOptions.map((option, index) => {
            const newOpt = options[index];
            return axios.patch(
              `${API_URL}/api/poll-options/${option.option_id}`,
              {
                option_text: newOpt.option_text,
              },
              { withCredentials: true }
            );
          })
        );
      } else {
        const response = await axios.post(
          `${API_URL}/api/polls/${user_id}`,
          payload,
          {
            withCredentials: true,
          }
        );
        const newPollId = response.data.poll_id;
        setPollId(newPollId);
        await Promise.all(
          options.map(async (option) => {
            await axios.post(
              `${API_URL}/api/poll-options/`,
              {
                option_text: option.option_text,
                poll_id: newPollId,
              },

              { withCredentials: true }
            );
          })
        );
      }

      setMessage("Vote Poll Created Successfully ✅");
      handleResetConfirmed();
      nav("/MyPolls");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to create vote poll ❌");
    }
    nav(`/share/${id}`);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { option_text: value };
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, { option_text: "" }]);
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
                value={opt.option_text}
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
