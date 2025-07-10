// backend/routes/compile.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();
const tmp = path.join(__dirname, "../temp");
if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

router.post("/", async (req, res) => {
  const { code, language, input } = req.body;
  const ts = Date.now();
  let srcFile,
    runCmd,
    args = [];

  // 1) Write source file and set runCmd + args
  switch (language) {
    case "cpp":
      srcFile = path.join(tmp, `code_${ts}.cpp`);
      fs.writeFileSync(srcFile, code);
      {
        const exe = path.join(tmp, `code_${ts}`);
        runCmd = exe;
        args = [];
        // Compile C++
        try {
          await new Promise((resolve, reject) => {
            const c = spawn("g++", [srcFile, "-o", exe]);
            let stderr = "";
            c.stderr.on("data", (d) => (stderr += d));
            c.on("close", (code) => {
              if (code === 0) resolve();
              else reject(stderr || "⚠️ C++ compile failed");
            });
          });
        } catch (err) {
          return res.json({ output: err });
        }
      }
      break;

    case "c":
      srcFile = path.join(tmp, `code_${ts}.c`);
      fs.writeFileSync(srcFile, code);
      {
        const exe = path.join(tmp, `code_${ts}`);
        runCmd = exe;
        args = [];
        // Compile C
        try {
          await new Promise((resolve, reject) => {
            const c = spawn("gcc", [srcFile, "-o", exe]);
            let stderr = "";
            c.stderr.on("data", (d) => (stderr += d));
            c.on("close", (code) => {
              if (code === 0) resolve();
              else reject(stderr || "⚠️ C compile failed");
            });
          });
        } catch (err) {
          return res.json({ output: err });
        }
      }
      break;

    case "python":
      srcFile = path.join(tmp, `code_${ts}.py`);
      fs.writeFileSync(srcFile, code);
      runCmd = "python3";
      args = [srcFile];
      break;

    case "javascript":
      srcFile = path.join(tmp, `code_${ts}.js`);
      fs.writeFileSync(srcFile, code);
      runCmd = "node";
      args = [srcFile];
      break;

    default:
      return res
        .status(400)
        .json({ output: `❌ Unsupported language: ${language}` });
  }

  // 2) Execute it and capture stdout/stderr
  const proc = spawn(runCmd, args);
  let stdout = "",
    stderr = "";

  // feed stdin
  proc.stdin.write(input || "");
  proc.stdin.end();

  proc.stdout.on("data", (data) => (stdout += data.toString()));
  proc.stderr.on("data", (data) => (stderr += data.toString()));

  proc.on("close", () => {
    // cleanup
    try {
      fs.unlinkSync(srcFile);
      if (language === "cpp" || language === "c") fs.unlinkSync(runCmd);
    } catch {}

    // return stderr if any, else stdout
    res.json({ output: stderr || stdout || "⚠️ No output" });
  });
});

module.exports = router;
