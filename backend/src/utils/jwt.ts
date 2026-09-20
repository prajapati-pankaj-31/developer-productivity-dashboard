import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'developer_productivity_dashboard_jwt_secret_2026';
const JWT_EXPIRES_IN = '7d';

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JwtUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtUserPayload {
  return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
}
