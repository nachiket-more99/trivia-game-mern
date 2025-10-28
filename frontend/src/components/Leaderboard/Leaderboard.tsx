import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../Navbar/Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Leaderboard.css";

interface Score {
  id: string;
  username: string;
  correct_answers: number;
}

function Leaderboard() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((response) => response.json())
      .then((data) => {
        let sortedScores = data.data.sort(function (a: any, b: any) {
          return b.correct_answers - a.correct_answers;
        });
        setScores(sortedScores);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <Navbar>
      <div className="bg">
        <div className="leaderboard-bg">
          <h2 className="leaderboard-heading">Leaderboard</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={score.id}>
                  <td>{index + 1}</td>
                  <td>{score.username}</td>
                  <td>{score.correct_answers}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Navbar>
  );
}

export default Leaderboard;
