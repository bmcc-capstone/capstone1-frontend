import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../shared";

const PollForm = ({ user }) => {
  // Get poll_id from URL params (React Router)
  const { poll_id } = useParams();
  console.log("POLLID", poll_id);

  // All poll options fetched from backend
  const [options, setOptions] = useState([]);

  // Array of selected options, in order they were clicked
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Fetch poll options when component starts or the poll_id changes
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/poll-options/${poll_id}`,
          {
            withCredentials: true,
          }
        );
        setOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch poll options:", error);
      }
    };

    fetchOptions();
  }, []);
  //   }, [poll_id, user?.user_id]);

  // Handle option click when an opiton is clicked or unclicked
  const handleOptionClick = (option) => {
    const isSelected = selectedOptions.find(
      (o) => o.option_id === option.option_id
    );

    let updatedSelections;
    if (isSelected) {
      // If already selected, remove from selectedOptions (unclick)
      updatedSelections = selectedOptions.filter(
        (o) => o.option_id !== option.option_id
      );
    } else {
      // If not selected, add to end of selectedOptions (click)
      updatedSelections = [...selectedOptions, option];
    }

    // Update the selected options state
    setSelectedOptions(updatedSelections);
  };

  // When submit is cliked it will make the ranked array and send a PATCH request to update ranks
  const handleSubmit = async () => {
    // Map selected options to an array of { ballotItem_id, rank }
    const rankedOptions = selectedOptions.map((opt, index) => ({
      ballotItem_id: opt.ballotItem_id,
      rank: index + 1,
    }));

    try {
      // Send PATCH request with ranked options to update ranks in backend
      const response = await axios.patch(
        `${API_URL}/api/ballotItems/update-rankings`,
        {
          updates: rankedOptions,
          poll_id,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to update ranks:", error);
    }
  };
  return <h1>hello</h1>;
};

export default PollForm;
