import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../Navbar/Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Leaderboard.css";

interface Score {
  id: string;
  username: string;
  correct_answers: number;
  time_seconds: number | null;
}

const FASTAPI_URL = process.env.REACT_APP_FASTAPI_URL || "http://localhost:8000";

function Leaderboard() {
  const { user } = useAuth0();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    fetch(`${FASTAPI_URL}/`)
      .then((response) => response.json())
      .then((data) => {
        setScores(data.data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const getRankDisplay = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  const getRowClass = (index: number, username: string) => {
    const isMe = user?.name === username;
    if (index === 0) return "lb-row top1";
    if (index === 1) return "lb-row top2";
    if (index === 2) return "lb-row top3";
    if (isMe) return "lb-row me";
    return "lb-row";
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === undefined) return "-";
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <Navbar>
      <div className="lb-wrapper">
        <div className="lb-header">
          <h2 className="lb-title">Leaderboard</h2>
          <p className="lb-sub">Top scores from all players</p>
        </div>

        <div className="lb-table">
          <div className="lb-cols">
            <span>Rank</span>
            <span>Player</span>
            <span>Time</span>
            <span>Score</span>
          </div>

          {scores.map((score, index) => (
            <div key={score.id} className={getRowClass(index, score.username)}>
              <div className="lb-rank">{getRankDisplay(index)}</div>
              <div className="lb-user">
                <div className="lb-username">
                  {score.username}
                  {user?.name === score.username && (
                    <span className="lb-you">you</span>
                  )}
                </div>
              </div>
              <div className="lb-time">{formatTime(score.time_seconds)}</div>
              <div className="lb-score-wrap">
                <div className="lb-score">{score.correct_answers}</div>
                <div className="lb-score-lbl">correct</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Navbar>
  );
}

export default Leaderboard;