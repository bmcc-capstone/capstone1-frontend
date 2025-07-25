import React, { useEffect, useState } from "react";
import "./shareableLink.css";
import { useParams } from "react-router-dom";
import { API_URL } from "../shared";
import axios from "axios";

const ShareableLinkPage = ({}) => {
  const id = useParams().id;
  const [link, setLink] = useState("");
  const [error, setError] = useState([]);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const pollData = await axios.get(`${API_URL}/api/polls/poll/${id}`, {
          withCredentials: true,
        });

        const link = pollData.data.shareableLink;
        console.log(link);
        setLink(link);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch shareableLink ❌");
      }
    };

    fetchPollData();
  }, [id]);

  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  return (
    <div className="shareableLinkContainer">
      <h3>✅ Your Poll Has Been Created!</h3>

      <div className="linkInformation">
        <p>🔗Share this link to collect votes:</p>

        <textarea value={`${link}`} readOnly />
        <button onClick={copyToClipBoard}>Copy to Clipboard</button>
      </div>
    </div>
  );
};

export default ShareableLinkPage;
