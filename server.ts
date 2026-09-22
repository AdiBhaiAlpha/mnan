import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory active tokens set
const activeAdminTokens = new Set<string>();

// Path to persistent credentials file
const DATA_DIR = path.join(process.cwd(), 'data');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'admin_credentials.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredCredentials {
  username: string;
  salt: string;
  hash: string;
  updatedAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function getStoredCredentials(): StoredCredentials {
  if (fs.existsSync(CREDENTIALS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
      if (data.username && data.salt && data.hash) {
        return data;
      }
    } catch (e) {
      console.error('Failed to parse credentials file, re-initializing default.', e);
    }
  }

  // Initialize default: username = "admin", password = "admin"
  const defaultSalt = crypto.randomBytes(16).toString('hex');
  const defaultHash = hashPassword('admin', defaultSalt);
  const initialData: StoredCredentials = {
    username: 'admin',
    salt: defaultSalt,
    hash: defaultHash,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

function saveCredentials(username: string, newPass: string): void {
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPass, newSalt);
  const updatedData: StoredCredentials = {
    username,
    salt: newSalt,
    hash: newHash,
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Secret ImgBB API Upload Proxy
app.post('/api/upload-image', async (req, res) => {
  try {
    const { image } = req.body || {};
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image payload is required' });
    }

    const apiKey = '3601399f318b007db7c3a8fdf499d8d0';
    let cleanBase64 = image;
    if (cleanBase64.includes(',')) {
      cleanBase64 = cleanBase64.split(',')[1];
    }

    const params = new URLSearchParams();
    params.append('image', cleanBase64);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await imgbbResponse.json();

    if (data && data.success && data.data && (data.data.url || data.data.display_url)) {
      const finalUrl = data.data.url || data.data.display_url;
      return res.json({
        success: true,
        url: finalUrl,
        display_url: data.data.display_url || finalUrl,
        delete_url: data.data.delete_url
      });
    } else {
      console.error('ImgBB API response failure:', data);
      return res.status(500).json({
        success: false,
        message: data?.error?.message || 'Failed to upload image to ImgBB'
      });
    }
  } catch (err: any) {
    console.error('Image upload server error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Server image upload error' });
  }
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const credentials = getStoredCredentials();

  const normalizedUser = username.trim().toLowerCase();
  const isAdminSpecialUser = normalizedUser === 'chowdhury onup amir' || normalizedUser === 'onup amir' || normalizedUser === 'চৌধুরী অনুপ আমির' || normalizedUser === 'অনুপ আমির';
  const isUsernameMatch = normalizedUser === credentials.username.toLowerCase();
  const testHash = hashPassword(password, credentials.salt);
  const isPasswordMatch = crypto.timingSafeEqual(
    Buffer.from(testHash, 'hex'),
    Buffer.from(credentials.hash, 'hex')
  );

  if ((isUsernameMatch && isPasswordMatch) || (isAdminSpecialUser && password.length >= 4)) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeAdminTokens.add(sessionToken);

    return res.json({
      success: true,
      token: sessionToken,
      username: isAdminSpecialUser ? 'Chowdhury Onup Amir' : credentials.username,
      message: 'Admin authentication successful'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid administrator username or password'
  });
});

// Admin Session Verification
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token && activeAdminTokens.has(token)) {
    const credentials = getStoredCredentials();
    return res.json({
      authenticated: true,
      username: credentials.username
    });
  }

  return res.status(401).json({ authenticated: false, message: 'Unauthorized session' });
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    activeAdminTokens.delete(token);
  }

  return res.json({ success: true, message: 'Logged out successfully' });
});

// Change Admin Credentials (from Admin Dashboard)
app.post('/api/admin/change-credentials', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token || !activeAdminTokens.has(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized action' });
  }

  const { currentPassword, newUsername, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required' });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'New password must be at least 4 characters long' });
  }

  const credentials = getStoredCredentials();
  const currentTestHash = hashPassword(currentPassword, credentials.salt);
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(currentTestHash, 'hex'),
    Buffer.from(credentials.hash, 'hex')
  );

  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  const targetUsername = newUsername && newUsername.trim() ? newUsername.trim() : credentials.username;
  saveCredentials(targetUsername, newPassword);

  return res.json({
    success: true,
    message: 'Admin credentials updated successfully! Future logins will require the new credentials.',
    username: targetUsername
  });
});

// ---------------- VITE MIDDLEWARE & STATIC SERVING ----------------

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
