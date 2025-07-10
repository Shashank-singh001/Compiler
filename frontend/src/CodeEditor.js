import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";

const languageExtensions = {
  javascript: [javascript()],
  python: [python()],
  cpp: [cpp()],
  c: [cpp()],
};

function CodeEditor({ language, code, onChange }) {
  return (
    <div className="code-editor">
      <CodeMirror
        value={code}
        height="400px"
        theme="dark"
        extensions={
          languageExtensions[language] || languageExtensions.javascript
        }
        onChange={(value) => onChange(value)}
      />
    </div>
  );
}

export default CodeEditor;
