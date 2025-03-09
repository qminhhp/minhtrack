import { query } from "./db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export async function createUser(
  email: string,
  password: string,
  fullName: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  const result = await query(
    "INSERT INTO users (id, email, password, full_name, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [userId, email, hashedPassword, fullName, new Date().toISOString()],
  );

  return result.rows[0];
}

export async function verifyUser(email: string, password: string) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return null;
  }

  return user;
}

export function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" },
  );
}

export async function getUserById(id: string) {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
}
