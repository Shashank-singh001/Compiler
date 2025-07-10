// frontend/src/App.js
import React, { useState } from "react";
import "./App.css";
import CodeEditor from "./CodeEditor";
// import LandingScreen from "./LandingScreen";
//import InteractiveBackground from "./InteractiveBackground";

function App() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleCompile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          input: inputValue,
        }),
      });

      const result = await response.json();
      console.log("🔍 Full API Response:", result);

      const combinedOutput = result.output;
      console.log("🔍 Full API Response:", result);



      if (combinedOutput.trim()) {
        setOutput(combinedOutput.trim());
      } else if (result.status?.description) {
        setOutput("⚠️ Status: " + result.status.description);
      } else {
        setOutput("⚠️ Unknown output. Full response in console.");
      }
    } catch (err) {
      console.error("❌ Compile error:", err);
      setOutput("❌ Compilation error. Backend unreachable or Judge0 error.");
    }
    setLoading(false);
  };

  const handleSmartFix = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/smartfix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      if (data.fixedCode) {
        // Strip markdown-style code blocks (```lang ... ```)
        const cleaned = data.fixedCode
          .replace(/```[\s\S]*?\n/, "") // removes ```cpp\n or similar
          .replace(/```$/, "") // removes trailing ```
          .trim();

        setCode(cleaned);
        //setOutput("// ✅ Code auto-corrected successfully!");
      } else {
        setOutput("⚠️ SmartFix failed to provide a valid fix.");
      }
    } catch (err) {
      console.error("SmartFix error:", err);
      setOutput("❌ SmartFix server error.");
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <h2 style={{ color: "white" }}>Auto Syntax Compiler</h2>
        <div className="language-toggle">
          <label htmlFor="lang">Language:</label>
          <select
            id="lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
        </div>
      </div>

      <div className="main-area">
        <div className="editor-section">
          <CodeEditor language={language} code={code} onChange={setCode} />
          <div className="input-box">
            <h3>Input</h3>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter input for your program"
              rows={4}
              style={{
                width: "100%",
                resize: "none",
                padding: "10px",
                borderRadius: "6px",
              }}
            />
          </div>
          <div className="buttons">
            <button onClick={handleCompile} disabled={loading}>
              {loading ? "Processing..." : "Compile"}
            </button>
            <button onClick={handleSmartFix} disabled={loading}>
              SmartFix
            </button>
          </div>
        </div>

        <div className="output-section">
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}
// function App() {
//   return (
//     <div>
//       <InteractiveBackground />
//     </div>
//   );
// }

export default App;
