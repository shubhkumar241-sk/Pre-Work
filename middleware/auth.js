require("dotenv").config();

function apiKeyAuth(req, res, next) {
  const apiKey = req.header("x-api-key");
  console.log("Received Key:", apiKey);
  console.log("Env Key:", process.env.API_KEY);

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }
  next();
}

module.exports = apiKeyAuth;
