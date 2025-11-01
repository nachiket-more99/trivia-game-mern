import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "../Navbar/Navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "./GameScreen.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const FASTAPI_URL = process.env.REACT_APP_FASTAPI_URL || "http://localhost:8000";

function QuizComponent() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestionsList, setQuizQuestionsList] = useState([
    {
      question: "question",
      options: { 1: "option1", 2: "option2", 3: "option3" },
      answer: 1,
    },
  ]);

  const currentQuestion = quizQuestionsList[currentQuestionIndex];

  const [showLoading, setShowLoading] = React.useState(false);
  const [showGameScreen, setShowGameScreen] = React.useState(true);
  const [showEndScreen, setShowEndScreen] = React.useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [finalScore, setFinalScore] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [answered, setAnswered] = React.useState(false);
  const [startTime] = React.useState<number>(Date.now());
  const [timeSeconds, setTimeSeconds] = React.useState<number>(0);

  React.useEffect(() => {
    fetch(`${BACKEND_URL}/question/list`)
      .then((response) => response.json())
      .then((data) => {
        setQuizQuestionsList(data.questionList);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const postScore = async (score: number, timeSeconds: number) => {
    if (user !== undefined) {
      await fetch(`${FASTAPI_URL}/`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.name,
          correct_answers: score,
          date: new Date().toISOString().slice(0, 10),
          time_seconds: timeSeconds,
        }),
      }).catch((err) => console.log(err.message));
    }
  };

  const calculateScore = (answers: number[]) => {
    setShowLoading(false);
    const timeSeconds = Math.round((Date.now() - startTime) / 1000);
    const matchingCount = answers.reduce((count, value, index) => {
      const { answer } = quizQuestionsList[index];
      if (Number(value) === answer) return count + 1;
      return count;
    }, 0);
    postScore(matchingCount, timeSeconds);
    setFinalScore(matchingCount);
    setTimeSeconds(timeSeconds);
    setShowEndScreen(true);
  };

  const handleOptionClick = (optionKey: string) => {
    if (answered) return;
    setSelectedOption(optionKey);
    setAnswered(true);

    setTimeout(() => {
      const newSelected = [...selected, parseInt(optionKey)];
      setSelected(newSelected);
      setSelectedOption(null);
      setAnswered(false);

      if (currentQuestionIndex === quizQuestionsList.length - 1) {
        setShowLoading(true);
        setShowGameScreen(false);
        calculateScore(newSelected);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 800);
  };

  const getOptionClass = (optionKey: string) => {
    if (!answered || selectedOption === null) return "g-opt";
    const isCorrect = parseInt(optionKey) === currentQuestion.answer;
    const isSelected = optionKey === selectedOption;
    if (isSelected && isCorrect) return "g-opt correct";
    if (isSelected && !isCorrect) return "g-opt wrong";
    if (!isSelected && isCorrect) return "g-opt correct";
    return "g-opt";
  };

  const optionLabels: { [key: string]: string } = {
    "1": "A",
    "2": "B",
    "3": "C",
    "4": "D",
  };

  const currentScore = selected.reduce((count, value, index) => {
    if (Number(value) === quizQuestionsList[index]?.answer) return count + 1;
    return count;
  }, 0);

  const progressPercent =
    (currentQuestionIndex / quizQuestionsList.length) * 100;

  const getEndContent = () => {
    const total = quizQuestionsList.length;
    const percent = (finalScore / total) * 100;
    const timeText = `${timeSeconds}s`;
    if (percent === 100)
      return {
        emoji: "🎉",
        title: "Perfect score!",
        sub: `All ${total} correct in ${timeText}`,
      };
    if (percent >= 60)
      return {
        emoji: "🙌",
        title: "Good job!",
        sub: `${finalScore} of ${total} correct in ${timeText}`,
      };
    if (percent >= 20)
      return {
        emoji: "💪",
        title: "Nice try!",
        sub: `${finalScore} of ${total} correct in ${timeText}`,
      };
    return {
      emoji: "😅",
      title: "Better luck next time!",
      sub: `${finalScore} of ${total} correct in ${timeText}`,
    };
  };

  return (
    <Navbar>
      <div className="game-wrapper">
        {showLoading && (
          <div className="game-spinner">
            <div className="spinner-ring"></div>
          </div>
        )}

        {!showLoading && showGameScreen && (
          <div className="game-body">
            <div className="game-card">
              <div className="game-top">
                <div className="game-counter">
                  Question {currentQuestionIndex + 1} of{" "}
                  {quizQuestionsList.length}
                </div>
                <div className="game-score-badge">Score: {currentScore}</div>
              </div>

              <div className="game-progress">
                <div
                  className="game-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="game-question">{currentQuestion.question}</div>

              <div className="game-options">
                {Object.entries(currentQuestion.options).map(
                  ([optionKey, optionValue]) => (
                    <div
                      key={optionKey}
                      className={getOptionClass(optionKey)}
                      onClick={() => handleOptionClick(optionKey)}
                    >
                      <div className="game-opt-key">
                        {optionLabels[optionKey] || optionKey}
                      </div>
                      {optionValue}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {showEndScreen && (
          <div className="game-end">
            <div className="game-end-circle">{getEndContent().emoji}</div>
            <h2 className="game-end-title">{getEndContent().title}</h2>
            <p className="game-end-sub">{getEndContent().sub}</p>
            <button
              className="game-end-btn"
              onClick={() => navigate("/leaderboard")}
            >
              View leaderboard
            </button>
          </div>
        )}
      </div>
    </Navbar>
  );
}

export default QuizComponent;
