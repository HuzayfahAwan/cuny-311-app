// server.cjs - Express backend for CUNY 311 App
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, "data", "requests.json");

// ─── Admin credentials ───────────────────────────────────────────────────────
// In production these would come from env vars / a real user store with hashed passwords.
const ADMIN_ACCOUNTS = [
  { username: "admin",     password: "cuny311",    displayName: "Admin"        },
  { username: "moderator", password: "cuny311mod", displayName: "Moderator"    },
];

// In-memory session store: token → { username, displayName, expiresAt }
const sessions = new Map();
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSession(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function requireAuth(req, res, next) {
  if (!getSession(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ─── Setup ────────────────────────────────────────────────────────────────────
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// ─── Middleware ───────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json());

// ─── Auth endpoints ───────────────────────────────────────────────────────────

// POST /api/admin/login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const account = ADMIN_ACCOUNTS.find(
    (a) => a.username === username && a.password === password
  );
  if (!account) {
    return res.status(401).json({ error: "Invalid credentials. Please try again." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    username: account.username,
    displayName: account.displayName,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  console.log(`[auth] ${account.displayName} signed in`);
  res.json({ token, admin: { username: account.username, displayName: account.displayName } });
});

// GET /api/admin/verify
app.get("/api/admin/verify", (req, res) => {
  const session = getSession(req);
  if (!session) return res.status(401).json({ valid: false });
  res.json({ valid: true, admin: { username: session.username, displayName: session.displayName } });
});

// POST /api/admin/logout
app.post("/api/admin/logout", (req, res) => {
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) sessions.delete(auth.slice(7));
  res.json({ success: true });
});

// ─── Request endpoints (protected) ───────────────────────────────────────────

function readRequests() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeRequests(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Public: submit a request (no auth needed — anyone can report)
app.post("/api/requests", (req, res) => {
  const { campus, category, description } = req.body || {};
  if (!campus || !category || !description) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  const requests = readRequests();
  const newReq = {
    id: requests.length > 0 ? Math.max(...requests.map((r) => r.id)) + 1 : 1,
    campus,
    category,
    description: description.trim(),
    status: "OPEN",
    submitted: new Date().toISOString(),
  };
  requests.unshift(newReq);
  writeRequests(requests);
  res.status(201).json(newReq);
});

// Protected: read all requests
app.get("/api/requests", requireAuth, (req, res) => {
  res.json(readRequests());
});

// Protected: update status
app.patch("/api/requests/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const valid = ["OPEN", "IN_PROGRESS", "RESOLVED", "CANCELLED"];
  if (!status || !valid.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  const requests = readRequests();
  const idx = requests.findIndex((r) => r.id === parseInt(id));
  if (idx === -1) return res.status(404).json({ error: "Not found." });
  requests[idx].status = status;
  writeRequests(requests);
  res.json(requests[idx]);
});

// ─── Root health check ────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    name: "CUNY 311 API",
    status: "ok",
    endpoints: [
      "POST /api/admin/login",
      "GET  /api/admin/verify",
      "POST /api/admin/logout",
      "POST /api/requests",
      "GET  /api/requests  (auth required)",
      "PATCH /api/requests/:id  (auth required)",
    ],
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 CUNY 311 API running at http://localhost:${PORT}`);
  console.log(`🔑 Default credentials: admin / cuny311`);
  console.log(`📁 Data: ${DATA_FILE}\n`);
});
