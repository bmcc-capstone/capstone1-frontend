import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="hero">
        <h1>Poll Stack</h1>
        <p className="tagline">
          The easiest way to create, share, and vote on polls.
        </p>
      </header>

      <section className="feature-grid">
        <div className="feature-card">
          <h3>Create Polls 💡</h3>
          <p>
            Create as many Voting Polls as you desire and save them in your “My
            Polls” section.
          </p>
        </div>

        <div className="feature-card">
          <h3>Group Polls 🧑‍🤝‍🧑</h3>
          <p>
            Want to share? Share polls with friends or groups and see results
            instantly.
          </p>
        </div>

        <div className="feature-card">
          <h3>Ranked Polls 🧊</h3>
          <p>
            Let users vote in order of preference, perfect for choosing top
            picks.
          </p>
        </div>
      </section>

      <div id="feature-card-center">
        <h3>Live Results 📊</h3>
        <p>Watch the votes roll in live, in real-time.</p>
      </div>

      <div className="cta-container">
        <Link to="/signup" className="cta-button">
          Start Polling Now!
        </Link>
      </div>
    </div>
  );
};
export default HomePage;
