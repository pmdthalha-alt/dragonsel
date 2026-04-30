module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({
    ok: true,
    service: "dragonsel-api",
    mode: "serverless",
    timestamp: new Date().toISOString()
  }));
};
