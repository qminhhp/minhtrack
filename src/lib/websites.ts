import { query } from "./db";
import { v4 as uuidv4 } from "uuid";

export async function getWebsitesByUserId(userId: string) {
  const result = await query(
    "SELECT * FROM websites WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

export async function getWebsiteById(id: string) {
  const result = await query("SELECT * FROM websites WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function createWebsite(
  name: string,
  url: string,
  description: string,
  userId: string
) {
  const websiteId = uuidv4();
  const trackingCode = generateTrackingCode();
  
  const result = await query(
    "INSERT INTO websites (id, name, url, description, user_id, tracking_code, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [websiteId, name, url, description, userId, trackingCode, new Date().toISOString(), new Date().toISOString()]
  );
  
  return result.rows[0];
}

export async function updateWebsite(
  id: string,
  name: string,
  url: string,
  description: string
) {
  const result = await query(
    "UPDATE websites SET name = $1, url = $2, description = $3, updated_at = $4 WHERE id = $5 RETURNING *",
    [name, url, description, new Date().toISOString(), id]
  );
  
  return result.rows[0];
}

export async function deleteWebsite(id: string) {
  await query("DELETE FROM websites WHERE id = $1", [id]);
}

function generateTrackingCode() {
  // Generate a random string for the tracking code
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
