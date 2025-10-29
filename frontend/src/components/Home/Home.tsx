import * as React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../Navbar/Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

function Home() {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handlePlayGame = () => {
    if (user !== undefined && isAuthenticated) {
      navigate("/game");
    } else {
      loginWithRedirect();
    }
  };

  return (
    <Navbar>
      <div className="home-wrapper">
        <div className="home-hero">

          <div className="home-left">
            <div className="home-tag">Full Stack Dev Quiz</div>
            <h1 className="home-headline">
              How well do you know <span className="home-accent">web dev?</span>
            </h1>
            <p className="home-desc">
              Challenge yourself with questions on React, Node.js, Docker, MongoDB and more. Climb the leaderboard.
            </p>
            <div className="home-btns">
              <Button className="btn-play" onClick={handlePlayGame}>
                Start Playing
              </Button>
              <Button className="btn-leaderboard" onClick={() => navigate("/leaderboard")}>
                Leaderboard
              </Button>
            </div>
          </div>

          <div className="home-right">
            <div className="preview-card">
              <div className="preview-label">Question 2 of 5</div>
              <div className="preview-question">
                Which tool is commonly used for version control in software development?
              </div>
              <div className="preview-options">
                <div className="preview-opt correct">GitHub</div>
                <div className="preview-opt">Docker</div>
                <div className="preview-opt">Jenkins</div>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-card">
                <div className="stat-num">5</div>
                <div className="stat-lbl">Questions</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">~3 min</div>
                <div className="stat-lbl">Avg time</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">Top 5</div>
                <div className="stat-lbl">Leaderboard</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Navbar>
  );
}

export default Home;