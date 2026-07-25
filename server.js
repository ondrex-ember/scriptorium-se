const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;

// Ensure dist folder and index.html are built
const distPath = path.join(__dirname, 'scriptorium', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.log('🔨 Building Scriptorium dist...');
  try {
    execSync('node scriptorium/build.js', { stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to run build script:', err);
  }
}

app.use(express.json());

// API Routes (Vercel serverless functions)
const bartolomejChat = require('./scriptorium/api/bartolomej-chat.js');
const registrumReport = require('./scriptorium/api/registrum-report.js');

app.post('/api/bartolomej-chat', (req, res) => {
  bartolomejChat(req, res);
});

app.post('/api/registrum-report', (req, res) => {
  registrumReport(req, res);
});

// Serve static assets from scriptorium/dist
app.use(express.static(distPath));

// Fallback to index.html for SPA/HTML navigation
app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
