import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyPolls.css";
import { API_URL } from "../shared";
import PollCard from "./pollCard";

const MyPolls = () => {
  const [polls, setPolls] = useState([]);
  const [tallies, setTallies] = useState({});
  const [error, setError] = useState("");

  // fetching user polls using username and user_id
  useEffect(() => {
    const fetchUserPolls = async () => {
      try {
        const userData = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });
        console.log("auth/me response:", userData.data);
        const username = userData.data.user?.username;
        if (!username) throw new Error("No username found");

        const findId = await axios.get(`${API_URL}/api/userId/${username}`, {
          withCredentials: true,
        });
        const userId = findId.data.user_id;

        const findPolls = await axios.get(
          `${API_URL}/api/polls/user/${userId}`,
          { withCredentials: true }
        );
        setPolls(findPolls.data);

        // Fetch tallies for all polls in parallel
        const tallyResults = await Promise.all(
          findPolls.data.map(async (poll) => {
            try {
              const res = await axios.get(
                `${API_URL}/api/tally/votes/${poll.poll_id}`,
                { withCredentials: true }
              );
              // Sum all voteCounts for this poll
              const totalVotes = res.data.reduce(
                (sum, item) => sum + (item.voteCount || 0),
                0
              );
              return { poll_id: poll.poll_id, totalVotes };
            } catch {
              return { poll_id: poll.poll_id, totalVotes: 0 };
            }
          })
        );
        // Convert array to object for quick lookup
        const tallyObj = {};
        tallyResults.forEach(({ poll_id, totalVotes }) => {
          tallyObj[poll_id] = totalVotes;
        });
        setTallies(tallyObj);
      } catch (err) {
        console.error(err);
        setError("Failed to load your polls ❌");
      }
    };

    fetchUserPolls();
  }, []);

  return (
    <div className="mypoll-container">
      <h2>My Polls 📊</h2>

      {error && <p className="error-message">{error}</p>}

      {polls.length === 0 && !error ? (
        <p>You haven't created any polls yet.</p>
      ) : (
        <div className="poll-list">
          {polls.map((poll) => (
            <PollCard
              key={poll.poll_id}
              id={poll.poll_id}
              title={poll.title}
              description={poll.description}
              expires_date={poll.expires_date}
              totalVotes={tallies[poll.poll_id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPolls;
