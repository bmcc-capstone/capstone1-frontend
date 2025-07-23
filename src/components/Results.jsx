import React, { useEffect, useState, useParams } from "react";
import "./pollCard.css";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import axios from "axios";

const Results = () => {
  const { poll_id } = useParams();
  const [rounds, setRounds] = useState([]);
  const [pollId, setPollId] = useState();
  const [ballots, setBallots] = useState([]);
  const [user_id, setUserId] = useState("");
  const [ballotItems, setBallotItems] = useState([]);

  useEffect(async () => {
    const ballotItem = await axios.get(
      `${API_URL}/ballotItems/poll/${poll_id}`
    );

    setBallotItems(ballotItem.data);
  });

  const uniqueUserIds = [...new Set(ballotItems.map((item) => item.user_id))];
  const grouped = uniqueUserIds.map((userId) =>
    ballotItems
      .filter((item) => item.user_id === userId)
      .order_by((item) => item.rank)
  );

  const resultsAlg = async () => {};
  return <h1>Hello</h1>;
};

export default Results;
