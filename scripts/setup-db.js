const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Create a connection pool to your PostgreSQL database
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DATABASE,
  ssl: process.env.POSTGRES_SSL === "true" 
    ? { rejectUnauthorized: false } 
    : undefined,
});

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL database');
    
    // Read the init.sql file
    const initSqlPath = path.join(__dirname, '..', 'migrations', 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    
    try {
      // Execute the entire SQL file at once
      await client.query(initSql);
      console.log('Database schema created successfully');
    } catch (err) {
      console.error('Error creating database schema:', err.message);
      
      // If the above fails, try executing each statement separately
      console.log('Trying to execute statements separately...');
      
      // Split the SQL statements by semicolon and filter out empty statements
      const statements = initSql.split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt !== '');
      
      // Execute each SQL statement
      for (const statement of statements) {
        try {
          await client.query(statement);
          console.log('Executed SQL statement successfully');
        } catch (err) {
          console.error('Error executing SQL statement:', err.message);
        }
      }
    }
    
    console.log('Database setup completed');
  } catch (err) {
    console.error('Error setting up database:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
