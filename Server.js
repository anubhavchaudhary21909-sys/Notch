const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

/* ===== PUT YOUR REAL API KEYS HERE ===== */
const DEEPSEEK_API_KEY = "sk-7b8f606f1af241c992779b2aa4a0d274";
const ELEVEN_API_KEY = "sk_5d50aeba2be285aca449a139fc68d0a50d8cbc984f62e59c";
const ELEVEN_VOICE_ID = "nPczCjzI2devNBz1zQrb";
/* ===================================== */

// ---------- AI CHAT ----------
app.post("/api/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + DEEPSEEK_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are NOTCH, a professional AI assistant." },
            { role: "user", content: prompt }
          ]
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI server error" });
  }
});

// ---------- SPEECH ----------
app.post("/api/speak", async (req, res) => {
  try {
    const text = req.body.text;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.7
          }
        })
      }
    );

    const audio = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audio));

  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

app.listen(PORT, () => {
  console.log("NOTCH running at http://localhost:" + PORT);
});
