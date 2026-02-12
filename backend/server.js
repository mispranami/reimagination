const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.get('/api/games', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Randomize stats for dynamic feel
    const dynamicGames = data.games.map(game => {
      // Create a deep copy to avoid mutating original
      const gameCopy = JSON.parse(JSON.stringify(game));
      
      // Parse the active players number (e.g., "180M" -> 180)
      const playersMatch = gameCopy.stats.active_players.match(/(\d+)([MK]?)/);
      if (playersMatch) {
        const baseValue = parseInt(playersMatch[1]);
        const suffix = playersMatch[2];
        // Add random variation (-5 to +5 for the base number)
        const variation = Math.floor(Math.random() * 11 - 5);
        const newValue = Math.max(1, baseValue + variation);
        gameCopy.stats.active_players = `${newValue}${suffix}`;
      }
      
      // Parse win rate (e.g., "52%" -> 52)
      const winRateMatch = gameCopy.stats.win_rate.match(/(\d+\.?\d*)%/);
      if (winRateMatch) {
        const baseRate = parseFloat(winRateMatch[1]);
        // Add random variation (-2 to +2 percentage points)
        const variation = (Math.random() * 4 - 2);
        const newRate = Math.max(0, Math.min(100, baseRate + variation));
        gameCopy.stats.win_rate = `${newRate.toFixed(1)}%`;
      }
      
      return gameCopy;
    });
    
    res.json({ games: dynamicGames });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load game data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
