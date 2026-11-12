'use strict';

/**
 * B_Oriented: Google Identity Services -> verified Workspace identity -> signed session cookie.
 * This initial implementation does not persist profiles; PostgreSQL will be added next.
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { randomBytes, timingSafeEqual } = require('node:crypto');

const router = express.Router();
router.use(cookieParser());

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const SESSION_SECRET = process.env.SESSION_SECRET;
const APP_ORIGIN = process.env.APP_ORIGIN;
const WORKSPACE_DOMAIN = process.env.WORKSPACE_DOMAIN || 'buonarroti.tn.it';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const SESSION_COOKIE = IS_PRODUCTION ? '__Host-bo_session' : 'bo_session';
const NONCE_COOKIE = IS_PRODUCTION ? '__Host-bo_login_nonce' : 'bo_login_nonce';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const NONCE_DURATION_MS = 10 * 60 * 1000;

const allowlist = (value) => new Set(
  (value || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
);
const ADMIN_EMAILS = allowlist(process.env.ADMIN_EMAILS);
const TEACHER_EMAILS = allowlist(process.env.TEACHER_EMAILS);

if (!CLIENT_ID || !APP_ORIGIN || !SESSION_SECRET || SESSION_SECRET.length < 48) {
  throw new Error('Configurazione auth assente: GOOGLE_CLIENT_ID, APP_ORIGIN, SESSION_SECRET (almeno 48 caratteri).');
}
if (IS_PRODUCTION && !APP_ORIGIN.startsWith('https://')) {
  throw new Error('In produzione APP_ORIGIN deve iniziare con https://');
}
const googleClient = new OAuth2Client(CLIENT_ID);
const sessionCookieSettings = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax',
  path: '/',
};

const noStore = (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};
router.use(noStore);

function rejectForeignOrigin(req, res, next) {
  // The web UI and /api are same-origin behind Nginx. Only accept POSTs from that origin.
  if (req.get('origin') !== APP_ORIGIN) {
    return res.status(403).json({ error: 'Origine della richiesta non autorizzata.' });
  }
  next();
}

function safeEqualStrings(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function publicUser(payload) {
  return {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
}

function getSession(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SESSION_SECRET, {
      algorithms: ['HS256'],
      issuer: 'b-oriented',
      audience: 'b-oriented-web',
    });
    if (typeof payload !== 'object' || typeof payload.sub !== 'string') return null;
    // Role is computed server-side. In the DB phase it will be read from PostgreSQL.
    return payload;
  } catch (_e) {
    return null;
  }
}

router.get('/nonce', (_req, res) => {
  const nonce = randomBytes(32).toString('base64url');
  res.cookie(NONCE_COOKIE, nonce, {
    ...sessionCookieSettings,
    maxAge: NONCE_DURATION_MS,
  });
  res.json({ nonce });
});

router.post('/google', rejectForeignOrigin, async (req, res) => {
  const credential = req.body?.credential;
  const expectedNonce = req.cookies?.[NONCE_COOKIE];
  if (typeof credential !== 'string' || credential.length < 100 || credential.length > 12000 || !expectedNonce) {
    return res.status(400).json({ error: 'Credenziale o nonce mancante.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const identity = ticket.getPayload();
    if (!identity || !safeEqualStrings(identity.nonce, expectedNonce)) {
      return res.status(401).json({ error: 'Nonce di autenticazione non valido.' });
    }
    if (identity.hd !== WORKSPACE_DOMAIN || identity.email_verified !== true) {
      return res.status(403).json({ error: 'Usa un account Google Workspace scolastico autorizzato.' });
    }
    const email = String(identity.email || '').toLowerCase();
    if (!email.endsWith('@' + WORKSPACE_DOMAIN)) {
      return res.status(403).json({ error: 'Dominio email non consentito.' });
    }
    const role = ADMIN_EMAILS.has(email) ? 'admin' : TEACHER_EMAILS.has(email) ? 'teacher' : 'student';
    const user = {
      sub: identity.sub, // Stable Google account identifier: do not use email as database PK.
      name: identity.name || email,
      email,
      role,
    };
    const signedSession = jwt.sign(user, SESSION_SECRET, {
      algorithm: 'HS256',
      expiresIn: '8h',
      issuer: 'b-oriented',
      audience: 'b-oriented-web',
    });
    res.clearCookie(NONCE_COOKIE, sessionCookieSettings);
    res.cookie(SESSION_COOKIE, signedSession, {
      ...sessionCookieSettings,
      maxAge: SESSION_DURATION_MS,
    });
    return res.json({ authenticated: true, user: publicUser(user) });
  } catch (err) {
    console.error('Google authentication failed:', err.message);
    return res.status(401).json({ error: 'Accesso Google non valido o scaduto.' });
  }
});

router.get('/me', (req, res) => {
  const session = getSession(req);
  return res.json(session
    ? { authenticated: true, user: publicUser(session) }
    : { authenticated: false, user: null });
});

router.post('/logout', rejectForeignOrigin, (_req, res) => {
  res.clearCookie(SESSION_COOKIE, sessionCookieSettings);
  res.clearCookie(NONCE_COOKIE, sessionCookieSettings);
  return res.json({ authenticated: false });
});

function requireAuth(req, res, next) {
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: 'Autenticazione richiesta.' });
  req.user = publicUser(session);
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permessi insufficienti.' });
    }
    next();
  };
}

module.exports = { authRouter: router, requireAuth, requireRole };
