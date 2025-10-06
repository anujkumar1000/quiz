import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function QuizPage({ questions, answers, setAnswers }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => {
    setSelected(null);
    setLocked(false);
    setTimeLeft(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [index, questions]);

  useEffect(() => {
    if (timeLeft <= 0 && !locked) {
      handleLock();

      // Auto move to next question after small delay
      setTimeout(() => {
        if (index + 1 < questions.length) {
          setIndex((i) => i + 1);
        } else {
          navigate("/results");
        }
      }, 1500); // delay to show answer feedback
    }
  }, [timeLeft, locked]);

  if (!questions || questions.length === 0)
    return <div className="card">Loading questions...</div>;

  const q = questions[index];

  function handleSelect(opt) {
    if (locked) return;
    setSelected(opt);
  }

  function handleLock() {
    setLocked(true);
    clearInterval(timerRef.current);
    const correct = q.correct_answer;
    const isCorrect = selected === correct;
    setAnswers((prev) => [
      ...prev,
      { qIndex: index, selected: selected, correct: correct, isCorrect },
    ]);
  }

  function handleNext() {
    if (!locked) return;
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
    } else {
      navigate("/results");
    }
  }

  function handleSubmitCurrent() {
    if (locked) return;
    if (selected === null) {
      toast.warning("⚠️ Please select an option before submitting.");
      return;
    }
    handleLock();
  }

  const progress = Math.round((index / questions.length) * 100);

  return (
    <div className="grid">
      <div className="card">
        <div className="question-meta">
          <div>
            Question <strong>{index + 1}</strong> of {questions.length}
          </div>
          <div className="timer">⏱ {timeLeft}s</div>
        </div>

        <div className="progress-bar" aria-hidden>
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>

        <div style={{ height: 12 }} />

        <div
          className="question-text"
          dangerouslySetInnerHTML={{ __html: q.question }}
        />

        <div className="options" role="list">
          {q.options.map((opt, i) => {
            let cls = "option";
            const answerRecord = answers.find((a) => a.qIndex === index);
            if (answerRecord) {
              if (opt === answerRecord.correct) cls += " correct";
              if (answerRecord.selected === opt && !answerRecord.isCorrect)
                cls += " wrong";
            } else {
              if (selected === opt) cls += " selected";
            }
            return (
              <div
                key={i}
                className={cls}
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(opt);
                }}
                tabIndex={0}
                role="button"
                aria-pressed={selected === opt}
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            );
          })}
        </div>

        <div className="actions">
          {!locked && (
            <button className="btn" onClick={handleSubmitCurrent}>
              Submit
            </button>
          )}
          {locked && (
            <button className="btn" onClick={handleNext}>
              {index + 1 === questions.length ? "Finish" : "Next"}
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Score & Progress</h3>
        <div style={{ marginTop: 8, fontSize: 18 }}>
          Correct: <strong>{answers.filter((a) => a.isCorrect).length}</strong>{" "}
          / {questions.length}
        </div>
        <div style={{ marginTop: 12 }}>
          <h4 style={{ margin: "8px 0" }}>Recent Answers</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {answers
              .slice(-5)
              .reverse()
              .map((a, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    borderBottom: "1px solid #333",
                    paddingBottom: 4,
                  }}
                >
                  <div>
                    Q {a.qIndex + 1}: {a.isCorrect ? "✅" : "❌"}{" "}
                    <span style={{ color: "var(--white)" }}>
                      {a.selected ? a.selected.toString().slice(0, 30) : "—"}
                    </span>
                  </div>
                  <div style={{ marginLeft: 16 }}>
                    <strong style={{ color: "#999" }}>Correct Answer:</strong>{" "}
                    <span style={{ color: "lightgreen" }}>{a.correct}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn" onClick={() => window.location.reload()}>
            Restart Full Quiz
          </button>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
      />
    </div>
  );
}
