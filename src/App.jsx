import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import QuizPage from "./components/QuizPage";
import Results from "./components/Results";
import questionsData from "./data/questions.json";

export default function App() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [startedAt, setStartedAt] = useState(null);

  useEffect(() => {
    setQuestions(shuffleQuestions(questionsData).slice(0, 10));
    setStartedAt(Date.now());
  }, []);

  function shuffleQuestions(qs) {
    const clone = qs.map((q) => ({ ...q }));

    // shuffle questions
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }

    // shuffle options
    return clone.map((q) => {
      const opts = [...q.incorrect_answers, q.correct_answer];
      for (let k = opts.length - 1; k > 0; k--) {
        const l = Math.floor(Math.random() * (k + 1));
        [opts[k], opts[l]] = [opts[l], opts[k]];
      }
      return { ...q, options: opts };
    });
  }

  return (
    <div className="app">
      <div className="header">
        <div className="brand">
          <div className="logo">QZ</div>
          <div>
            <h1>Quiz App</h1>
          </div>
        </div>
        <div className="controls">
          <button
            className="btn"
            onClick={() => {
              setQuestions(shuffleQuestions(questionsData).slice(0, 10));
              setAnswers([]);
              navigate("/");
            }}
          >
            Restart
          </button>
          <button className="btn" onClick={() => navigate("/results")}>
            Results
          </button>
        </div>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <QuizPage
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
            />
          }
        />
        <Route
          path="/results"
          element={
            <Results
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
            />
          }
        />
      </Routes>
    </div>
  );
}
