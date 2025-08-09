import React, { useState } from "react";
import { jsonrepair } from "jsonrepair";
import "./index.css";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [lineCol, setLineCol] = useState<{ line: number; column: number } | null>(null);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError("");
      setLineCol(null);
    } catch (err: any) {
      pinpointError(err);
    }
  };

  const pinpointError = (err: SyntaxError) => {
    const message = err.message;
    const match = message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const before = input.slice(0, pos);
      const lines = before.split("\n");
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setError(err.message);
      setLineCol({ line, column });
    } else {
      setError(err.message);
      setLineCol(null);
    }
  };

  const clearInput = () => {
    setInput("");
    setError("");
    setLineCol(null);
  };

  const fixJSON = () => {
    try {
      const repaired = jsonrepair(input);
      setInput(JSON.stringify(JSON.parse(repaired), null, 2));
      setError("");
      setLineCol(null);
    } catch (err: any) {
      setError("Unable to auto-fix this JSON.");
    }
  };

  return (
    <div className="container">
      <h1>ET JSON Formatter & Validator</h1>
      <textarea
        placeholder="Paste your JSON here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={error ? "error" : ""}
      />
      {error && (
        <div className="error-message">
          ❌ {error}
          {lineCol && (
            <span>
              {" "}
              (Line {lineCol.line}, Column {lineCol.column})
            </span>
          )}
        </div>
      )}
      <div className="button-row">
        <button onClick={formatJSON}>Format JSON</button>
        <button onClick={clearInput} className="clear">
          Clear
        </button>
        {error && (
          <button onClick={fixJSON} className="fix">
            Fix JSON
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
