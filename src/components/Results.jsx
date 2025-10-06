import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Results({ questions, answers, setAnswers }) {
  const navigate = useNavigate();
  const total = questions.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const [high, setHigh] = useState(0);

  useEffect(() => {
    const prev = Number(localStorage.getItem("quiz_high") || 0);
    if (correctCount > prev) {
      localStorage.setItem("quiz_high", String(correctCount));
      setHigh(correctCount);
    } else setHigh(prev);
  }, []);

  if (questions.length === 0)
    return <div className="card">No results yet — take the quiz.</div>;

  return (
    <div className="card">
      <h2>Results</h2>
      <div style={{ fontSize: 18, marginTop: 8 }}>
        You scored <strong>{correctCount}</strong> / {total}
      </div>
      <div style={{ marginTop: 8, color: "var(--muted)" }}>
        High score: {high} / {total}
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Summary</h3>
        <div className="result-list" style={{ marginTop: 8 }}>
          {questions.map((q, idx) => {
            const a = answers.find((x) => x.qIndex === idx);
            const user = a ? a.selected : null;
            const correct = q.correct_answer;
            const ok = a ? a.isCorrect : false;
            return (
              <div className="result-item" key={idx}>
                <div style={{ maxWidth: "70%" }}>
                  <div dangerouslySetInnerHTML={{ __html: q.question }} />
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    Your answer:{" "}
                    <span
                      style={{ color: ok ? "lightgreen" : "salmon" }}
                      dangerouslySetInnerHTML={{ __html: user || "—" }}
                    />
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>
                    {ok ? "Correct" : "Wrong"}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    Correct:{" "}
                    <span dangerouslySetInnerHTML={{ __html: correct }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button
          className="btn"
          onClick={() => {
            // reset and go to start
            setAnswers([]);
            navigate("/");
            window.location.reload();
          }}
        >
          Restart Quiz
        </button>
        <button
          className="btn"
          onClick={() => {
            // download results as JSON file
            const payload = { questions, answers, score: correctCount };
            const dataStr =
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(payload, null, 2));
            const a = document.createElement("a");
            a.setAttribute("href", dataStr);
            a.setAttribute("download", "quiz-results.json");
            document.body.appendChild(a);
            a.click();
            a.remove();
          }}
        >
          Download Results
        </button>
      </div>
    </div>
  );
}
