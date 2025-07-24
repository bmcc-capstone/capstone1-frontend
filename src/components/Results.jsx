// import React, { useEffect, useState, useParams } from "react";
// import "./pollCard.css";
// import { Link, useNavigate } from "react-router-dom";
// import { API_URL } from "../shared";
// import axios from "axios";

// const Results = () => {
//   const { poll_id } = useParams();
//   const [rounds, setRounds] = useState([]);
//   const [pollId, setPollId] = useState();
//   const [ballots, setBallots] = useState([]);
//   const [user_id, setUserId] = useState("");
//   const [ballotItems, setBallotItems] = useState([]);
//   const [count, setCount] = useState([]);
//   const [options, setOptions] = useState([]);

//   useEffect(async () => {
//     try {
//       const ballotItem = await axios.get(
//         `${API_URL}/ballotItems/poll/${poll_id}`
//       );

//       setBallotItems(ballotItem.data);
//       const response = await axios.get(
//         `${API_URL}/api/poll-options/${poll_id}`,
//         {
//           withCredentials: true,
//         }
//       );
//       setOptions(response.data);
//     } catch (error) {
//       console.error("Failed to fetch poll options:", error);
//     }
//   });

//   const grouping = async () => {
//     const uniqueUserIds = [...new Set(ballotItems.map((item) => item.user_id))];
//     const grouped = uniqueUserIds.map((userId) =>
//       ballotItems
//         .filter((item) => item.user_id === userId)
//         .sort((a, b) => a.rank - b.rank)
//     );
//     const rankOneGrouped = grouped.map((group) => group[0]);
//     console.log(grouped);
//     console.log(rankOneGrouped);
//   };

//   return <h1>Hello</h1>;
// };
// export default Results;
