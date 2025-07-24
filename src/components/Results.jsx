import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const Results = () => {
  const { poll_id } = useParams();
  const [poll, setPoll] = useState(null);
  const [ballotItems, setBallotItems] = useState([]);
  const [grouped, setGrouped] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch poll info and ballot items on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollRes = await axios.get(`${API_URL}/polls/${poll_id}`);
        setPoll(pollRes.data);

        const ballotItemRes = await axios.get(`${API_URL}/ballotItems/poll/${poll_id}`);
        const items = ballotItemRes.data;
        setBallotItems(items);

        // Group ballot items by user_id and sort by rank ascending
        const groupedBallots = Object.values(
          items.reduce((acc, item) => {
            if (!acc[item.user_id]) acc[item.user_id] = [];
            acc[item.user_id].push(item);
            return acc;
          }, {})
        ).map((ballot) => ballot.sort((a, b) => a.rank - b.rank));

        setGrouped(groupedBallots);
      } catch (err) {
        setError("Failed to fetch poll or ballots.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [poll_id]);

  // Trigger results calculation only if poll expired and ballots loaded
  useEffect(() => {
    if (poll && grouped.length > 0) {
      const now = new Date();
      const expiresAt = new Date(poll.expires_date);
      if (now >= expiresAt) {
        calculateResults(grouped);
      }
    }
  }, [poll, grouped]);

  // Ranked Choice Voting logic with majority winner detection
  const calculateResults = (grouped) => {
    let rounds = [];
    let winner = null;

    // Get unique option IDs remaining in the race
    let remainingOptions = new Set(grouped.flat().map((item) => item.option_id));

    while (!winner && remainingOptions.size > 1) {
      // Get each ballot's highest-ranked remaining option
      const firstChoices = grouped
        .map((ballot) => ballot.find((item) => remainingOptions.has(item.option_id)))
        .filter(Boolean);

      // Count votes for each option
      const tally = {};
      for (const vote of firstChoices) {
        tally[vote.option_id] = (tally[vote.option_id] || 0) + 1;
      }
      rounds.push({ ...tally });

      const totalVotes = firstChoices.length;
      // Sort options by votes ascending
      const sortedOptions = Object.entries(tally).sort((a, b) => a[1] - b[1]);
      const [topOption, topVotes] = sortedOptions[sortedOptions.length - 1];

      // Check majority (more than 50%)
      if (topVotes > totalVotes / 2) {
        winner = parseInt(topOption, 10);
        break;
      }

      // Eliminate lowest option
      const [lowestOption] = sortedOptions[0];
      remainingOptions.delete(parseInt(lowestOption, 10));

      // Remove eliminated option from all ballots
      grouped.forEach((ballot) => {
        const index = ballot.findIndex((item) => item.option_id === parseInt(lowestOption, 10));
        if (index !== -1) ballot.splice(index, 1);
      });
    }

    setResults({ winner, rounds });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Show results only if poll expired
  const now = new Date();
  const expiresAt = new Date(poll.expires_date);
  const isExpired = now >= expiresAt;

  // Helper to get option text by ID
  const getOptionText = (optionId) => {
    const option = poll.pollOptions?.find((opt) => opt.option_id === optionId);
    return option ? option.option_text : `Option ${optionId}`;
  };

  return (
    <div className="results-page">
      <h1>Poll Results</h1>
      {!isExpired ? (
        <p>The poll is still active. Results will be available after {expiresAt.toLocaleString()}.</p>
      ) : results ? (
        <div>
          <h2>Winner: {getOptionText(results.winner)}</h2>
          <h3>Rounds:</h3>
          {results.rounds.map((round, index) => (
            <div key={index}>
              <strong>Round {index + 1}:</strong>
              <ul>
                {Object.entries(round).map(([option, count]) => (
                  <li key={option}>
                    {getOptionText(parseInt(option, 10))}: {count} vote{count !== 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>Calculating results...</p>
      )}
    </div>
  );
};

export default Results;
