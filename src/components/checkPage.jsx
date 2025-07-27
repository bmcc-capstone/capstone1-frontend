import React, { useEffect, useState } from "react";
import "./checkPage.css";
import { useParams } from "react-router-dom";
import { API_URL } from "../shared";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckPollPage = ({}) => {
  const { slug }  = useParams();
  const [error, setError] = useState([]);
  const [pollData, setPollData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const poll = await axios.get(`${API_URL}/api/polls/${slug}`, {
          withCredentials: true,
        });
      
      setPollData(poll.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch poll information ❌");
    }
  };

    fetchPollData();
  }, [slug]);

  console.log(pollData);

 useEffect(() => {
    const now = new Date();
    const expires = new Date(pollData.expires_date);

    const time = setTimeout(() => {
        if (expires < now) {
            navigate(`/results/${pollData.poll_id}`);
        } else {
            navigate(`/pollVotingPage/${pollData.poll_id}`);
        }
    }, 3000);
    
 }, [pollData, navigate]);

  return (
    <div className="container">
        <h3>Loading...</h3>
        <img src="/pacman-loading.gif" alt="Loading logo" className="loading-logo"/>
    </div>
  );
};

export default CheckPollPage;
