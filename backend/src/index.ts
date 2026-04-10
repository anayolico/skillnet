import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * @api {get} /health Liveness probe
 * Returns 200 if the server is running.
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @api {get} /ready Readiness probe
 * Returns 200 if the server is ready to handle requests.
 */
app.get('/ready', (req: Request, res: Response) => {
  // Add logic here to check for database connectivity or other dependencies
  res.status(200).json({
    ready: true,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('SkillNet Backend API is running');
});

// Start server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
