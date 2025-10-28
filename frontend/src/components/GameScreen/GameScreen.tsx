import * as React from "react";
import { Button, Form, Card, Spinner, Col, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./GameScreen.css";

import Navbar from "../Navbar/Navbar";

import { useState } from "react";

function QuizComponent() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestionsList, setQuizQuestionsList] = useState([
    {
      question: "question",
      options: {
        1: "option1",
        2: "option2",
        3: "option3",
      },
      answer: 1,
    },
  ]);

  const currentQuestion = quizQuestionsList[currentQuestionIndex];

  const [showLoading, setShowLoading] = React.useState(false);
  const [showGameScreen, setShowGameScreen] = React.useState(true);
  const [showEndScreen, setShowEndScreen] = React.useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [finalScore, setFinalScore] = React.useState(0);

  React.useEffect(() => {
    fetch("/question/list")
      .then((response) => response.json())
      .then((data) => {
        setQuizQuestionsList(data.questionList);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const postScore = async (score: number) => {
    if (user !== undefined) {
      await fetch("http://localhost:8000/", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.name,
          correct_answers: score,
          date: new Date().toISOString().slice(0, 10),
        }),
      })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const calculateScore = () => {
    setShowLoading(false);
    const matchingCount = selected.reduce((count, value, index) => {
      const { answer } = quizQuestionsList[index];
      if (Number(value) === answer) {
        return count + 1;
      }
      return count;
    }, 0);
    postScore(matchingCount);
    setFinalScore(matchingCount);
    setShowEndScreen(true);
  };

  const handleNextQuestion = (event: any) => {
    setSelected((oldArray) => [...oldArray, event.target.value]);
    if (currentQuestionIndex == quizQuestionsList.length - 1) {
      setShowLoading(true);
      setShowGameScreen(false);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  React.useEffect(() => {
    if (selected.length == 5) {
      calculateScore();
    }
  }, [selected]);

  const handleOpenLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <Navbar>
      <div className="bg">
        {showLoading && (
          <div className="spinner-container">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {!showLoading && showGameScreen && (
          <div className="game-bg">
            <Card className="game-card">
              <Card.Body>
                <div className="trivia-card">
                  <Card>
                    <Card.Header>{currentQuestion.question}</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        {Object.entries(currentQuestion.options).map(
                          ([optionKey, optionValue]) => (
                            <Button
                              className="mt-4"
                              id="option-btn"
                              variant="primary"
                              onClick={handleNextQuestion}
                              value={optionKey}
                            >
                              {optionValue}
                            </Button>
                          )
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
        {showEndScreen && (
          <div className="game-finish-container">
            <h2 className="heading">Good Job!</h2>
            <h4 className="sub-heading">
              you got {finalScore} out of 5 correct
            </h4>
            <div>
              <Button
                variant="primary"
                className="mt-4"
                id="open-leaderboard"
                onClick={handleOpenLeaderboard}
              >
                LEADERBOARD
              </Button>
            </div>
          </div>
        )}
      </div>
    </Navbar>
  );
}

export default QuizComponent;
