import express from "express";

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
