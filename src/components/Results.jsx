import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Results.css";
import { API_URL } from "../shared";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { Bar } from "react-chartjs-2";

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
        console.log(poll_id);
        setLoading(true);
        const pollRes = await axios.get(`${API_URL}/api/polls/poll/${poll_id}`);
        setPoll(pollRes.data);

        const ballotRes = await axios.get(
          `${API_URL}/api/ballotItems/${poll_id}`
        );
        setBallotItems(ballotRes.data);
      } catch (err) {
        setError("Failed to fetch poll or ballots.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [poll_id]);

  // Group ballots by user_id and sort by rank ascending
  useEffect(() => {
    if (ballotItems.length === 0) return;

    const uniqueUserIds = [...new Set(ballotItems.map((item) => item.user_id))];
    const groupedBallots = uniqueUserIds.map((userId) =>
      ballotItems
        .filter((item) => item.user_id === userId)
        .sort((a, b) => a.rank - b.rank)
    );

    setGrouped(groupedBallots);
  }, [ballotItems]);

  // Call backend to calculate results once grouped ballots are ready
  useEffect(() => {
    const fetchResults = async () => {
      if (grouped.length === 0) return;

      try {
        setLoading(true);
        const res = await axios.post(`${API_URL}/api/polls/results`, {
          grouped,
        });
        setResults(res.data);
      } catch (err) {
        setError("Failed to fetch results");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [grouped]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!poll) return <p>Poll not found.</p>;

  // Helper function to generate distinct colors based on option index and total count
  const generateColor = (index, total) => {
    const hue = Math.round((index / total) * 360); // evenly spaced hues around the color wheel
    return `hsl(${hue}, 70%, 50%)`; // vibrant color with fixed saturation and lightness
  };

  const renderBarChart = () => {
    if (!results || !poll) return null;

    const totalOptions = poll.pollOptions.length;
    const roundLabels = results.rounds.map((_, i) => `Round ${i + 1}`);

    // For each option, we build a dataset: each dataset is one bar per round
    const datasets = poll.pollOptions.map((opt, optIndex) => {
      return {
        label: opt.option_text,
        data: results.rounds.map((round) => round[opt.option_id] || 0),
        // Use eliminatedPerRound to determine when to color grey
        backgroundColor: results.rounds.map((_, roundIndex) => {
          const eliminatedThisRound =
            results.eliminatedPerRound?.[roundIndex] || [];
          return eliminatedThisRound.includes(opt.option_id)
            ? "rgba(180, 180, 180, 0.6)" // grey if eliminated in this round
            : generateColor(optIndex, totalOptions); // consistent color otherwise
        }),
      };
    });

    const chartData = {
      labels: roundLabels, // rounds on x-axis
      datasets,
    };

    const options = {
      indexAxis: "x", // <- vertical bars (default)
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: poll.title },
      },
      scales: {
        x: {
          stacked: false,
          ticks: { maxRotation: 0, autoSkip: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
          },
        },
      },
    };

    return (
      <div className="results-chart-container">
        <Bar data={chartData} options={options} />
      </div>
    );
  };

  const getWinnerText = () => {
    if (!results || !poll || !results.winner) return null;
    const winnerOption = poll.pollOptions.find(
      (opt) => String(opt.option_id) === String(results.winner)
    );
    return winnerOption ? winnerOption.option_text : null;
  };

  return (
    <div className="results-page">
      <div className="results-header">
        <h2 className="results-title">{poll.title}</h2>
        <p className="results-description">{poll.description}</p>
        {getWinnerText() && (
          <div className="winner-banner">
            <strong>Winner:</strong>{" "}
            <span className="winner-text">{getWinnerText()}</span>
          </div>
        )}
      </div>
      <div className="results-chart-container">
        {renderBarChart()}
      </div>
    </div>
  );
};

export default Results;
