import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { routeApiRequest } from './api-handlers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Standard limits for body processing
  app.use(express.json());

  // Direct Express middleware passing into our route filter
  app.use(async (req, res, next) => {
    try {
      const handled = await routeApiRequest(req, res);
      if (!handled) {
        next();
      }
    } catch (err: any) {
      console.error("Express routing error:", err);
      res.status(500).json({ error: err.message || "Internal Gateway Server Error" });
    }
  });

  // Serve static assets in production
  app.use(express.static(path.join(__dirname, 'dist')));

  // Redirect all secondary web routes to index.html for SPA support
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zenith production workspace listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
