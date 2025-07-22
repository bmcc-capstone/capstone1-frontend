import React from "react";
import "./pollCard.css";
import { Link } from "react-router-dom";

const PollCard = ({ title, description, id, expires_date, totalVotes }) => {
    return (
        <Link to={`/Pollform/${id}`} className="pollCardLink">
            <div className="pollContainer">
                <div className="info">
                    <h3 id="title">{title}</h3>
                    <p id="description">{description}</p>
                    {expires_date && (
                        <p className="expires">
                            Expires: {new Date(expires_date).toLocaleString()}
                        </p>
                    )}
                    <p className="votes">Total Votes: {totalVotes ?? 0}</p>
                </div>
            </div>
        </Link>
    );
};
//accepts and displays expiration and vote count
export default PollCard;
