import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BASEURL = "https://api.deezer.com";

// Enable CORS middleware so your React frontend can read this data without errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// Endpoint to fetch Deezer charts
app.get("/api/top", async (req, res) => {
  try {
    // Fetch global charts directly from Deezer on the server side
    const response = await fetch(BASEURL + "/chart");
    if (!response.ok) {
      throw new Error(`Deezer API responded with status: ${response.status}`);
    }

    const fullData = await response.json();

    // Extract ONLY the tracks node object safely
    const tracksSection = fullData.tracks || { data: [] };

    // Return the specific track payload object matching your exact requirements
    res.json({
      tracks: tracksSection,
    });
  } catch (error) {
    console.error("Deezer Server Error:", error);
    res
      .status(500)
      .json({ error: "Failed to extract music charts from Deezer" });
  }
});

app.get("/api/trending", async (req, res) => {
  try {
    // Fetch global charts directly from Deezer on the server side
    const response = await fetch(BASEURL + "/editorial/0/releases?limit=20");
    if (!response.ok) {
      throw new Error(`Deezer API responded with status: ${response.status}`);
    }

    const fullData = await response.json();

    // Extract ONLY the tracks node object safely
    const tracksSection = fullData.data;

    // Return the specific track payload object matching your exact requirements
    res.json({
      tracks: { data: tracksSection },
    });
  } catch (error) {
    console.error("Deezer Server Error:", error);
    res
      .status(500)
      .json({ error: "Failed to extract music charts from Deezer" });
  }
});

app.get("/spotify/token", async (req, res) => {
  // console.log("Zzzz", console.log(process.env.CLIENT_ID));

  const credentials = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
  ).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  res.json(response.data);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
