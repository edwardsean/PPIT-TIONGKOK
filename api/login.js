// api/login.js
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Disable caching for login HTML (optional)
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Serve the index.html (you can also just use /mainpage.html from public/)
    try {
      const filePath = join(__dirname, '../public/index.html');
      const content = await fs.readFile(filePath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(content);
    } catch (err) {
      return res.status(500).send('Could not load index.html');
    }
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;

    const validUsername = process.env.USERNAME;
    const validPassword = process.env.PASSWORD;

    if (username === validUsername && password === validPassword) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}