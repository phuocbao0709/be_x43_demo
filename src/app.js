"use strict";

const { connectDb } = require("./config/db");
const { createApp } = require("./create-app");

let isDbConnected = false;
let app = null;

const ensureDbConnected = async () => {
  if (isDbConnected) return;
  await connectDb();
  isDbConnected = true;
};

async function handler(req, res) {
  try {
    if (req.method === "GET" && (req.url === "/api/health" || req.url === "/health")) {
      return res.status(200).json({ ok: true });
    }

    if (!app) {
      app = createApp();
    }

    await ensureDbConnected();

    return app(req, res);
  } catch (error) {
    console.error("Vercel handler error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error"
    });
  }
}

module.exports = handler;
module.exports.default = handler;
