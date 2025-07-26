// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../shared";
// import "./LivePoll.css";

// const LivePoll = () => {
//   const { pollId } = useParams();

//   const [poll, setPoll] = useState(null);
//   const [userCount, setUserCount] = useState(0);
//   const [error, setError] = useState("");

//   // Fetch poll data by pollId
//   useEffect(() => {
//     if (!pollId) {
//       setError("Poll ID is missing in the URL ❌");
//       return;
//     }

//     const fetchPoll = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/api/polls/poll/${pollId}`);
//         setPoll(response.data);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load poll ❌");
//       }
//     };

//     fetchPoll();
//   }, [pollId]);

//   // Fetch simulated user count every 3 seconds
//   useEffect(() => {
//     if (!pollId) return;

//     const fetchUserCount = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/polls/${pollId}/users`);
//         setUserCount(res.data.userCount);
//       } catch (err) {
//         console.error("Error fetching user count", err);
//       }
//     };

//     fetchUserCount();
//     const interval = setInterval(fetchUserCount, 3000);

//     return () => clearInterval(interval);
//   }, [pollId]);

//   if (error) {
//     return <div className="livepoll-error">{error}</div>;
//   }

//   if (!poll) {
//     return <div className="livepoll-loading">Loading Poll...</div>;
//   }

//   return (
//     <div className="livepoll-container">
//       <h2>Live Poll: {poll.title}</h2>
//       <p>{poll.description}</p>

//       <div className="livepoll-info">
//         <p><strong>Users viewing:</strong> {userCount}</p>
//         <p><strong>Expires:</strong> {new Date(poll.expires_date).toLocaleString()}</p>
//       </div>

//       {/* Here you can add your voting UI - options/buttons etc. */}
//       {/* For example, if poll.pollOptions exist, render options to vote */}

//     </div>
//   );
// };

// export default LivePoll;
