// backend/server.js

require("dotenv").config(); // ✅ Load .env variables
const express = require("express"); // ✅ You MUST include this
const cors = require("cors");

const app = express();

// ✅ Import routes
const compileRoute = require("./routes/compile"); // This must export a router
const smartfixRoute = require("./routes/smartfix");

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/compile", compileRoute);
app.use("/api/smartfix", smartfixRoute);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
