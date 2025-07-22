import React from "react";
import "./shareableLink.css"
import { Link } from "react-router-dom";

const ShareableLinkPage = () => {
    return (
      <div className="shareableLinkContainer">
        <h3>✅ Your Poll Has Been Created!</h3>

        <div className="linkInformation">
          <p>Share this link to collect votes:</p>
          <textarea>🔗the-link-goes-here</textarea>
        </div>
      </div>    
    );
};

export default ShareableLinkPage;
