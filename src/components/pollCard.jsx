import React from "react";
import "./pollCard.css";
import { Link } from "react-router-dom";

const PollCard = ({ title, description, id}) => {
    return (
        <Link to={`/Pollform/${id}`} className="pollCardLink">
            <div className="pollContainer">

            <div className="info">

                <h3 id="title">{title}</h3>       

                <p id="description">{description}</p>

            </div>

        </div>
        </Link>
        
    );
};

export default PollCard;
