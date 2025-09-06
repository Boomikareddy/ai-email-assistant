import React, { useState } from "react";
import "./App.css";

function App() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!emailText.trim()) {
      alert("Please type an email before predicting!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailText }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Check if backend is running!");
    }
  };

  return (
    <div className="App">
      <h2>📧 AI Email Assistant</h2>
      <textarea
        rows="6"
        placeholder="Type your email here..."
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
      />
      <br />
      <button onClick={handlePredict}>Predict</button>

      {result && (
        <div className="result-card">
          <h3>Prediction Result</h3>
          <p>
            <b>Category:</b> {result.predicted_category}
          </p>
          <p>
            <b>Matched Example:</b> {result.matched_example}
          </p>
          <p>
            <b>Sender:</b> {result.sender}
          </p>
          <p>
            <b>Subject:</b> {result.subject}
          </p>
          <p>
            <b>Date:</b> {result.date}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
