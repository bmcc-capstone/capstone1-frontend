import React, { useState } from "react";
import axios from "axios";
import "./CreatePollForm.css"; 

const CreatePollForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [publicPoll, setPublicPoll] = useState(false);
  const [message, setMessage] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        description,
        public: publicPoll, 
        expires_date: expirationDate || null,
        options: options.filter((opt) => opt.trim() !== "")
      };

      if (payload.options.length < 2) {
        setMessage("Please provide at least 2 options ❗");
        return;
      }

      const response = await axios.post("http://localhost:8080/api/polls/createpoll/${userId}", payload, {
        withCredentials: true
      });

      setMessage("Vote Poll Created Successfully ✅");
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
      setPublicPoll(false);
      setExpirationDate("");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Failed to create vote poll ❌");
    }
  };

  return (
    <div className="create-vote-poll-container">
      <h2>Create a Vote Poll</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
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

        <label>Expiration Date (optional):</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />

        <div className="public-poll-checkbox">
          <input
            type="checkbox"
            checked={publicPoll}
            onChange={(e) => setPublicPoll(e.target.checked)}
          />
          <label>Allow guests (unauthorized users) to vote</label>
        </div>

        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
};

export default CreatePollForm;
