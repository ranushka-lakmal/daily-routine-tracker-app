import * as SQLite from 'expo-sqlite';

let dbInstance = null;

// --- OPEN DATABASE ---
export async function getDB() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('drt.db');
  }
  return dbInstance;
}

// --- INITIALIZE DATABASE STRUCTURE ---
export async function initDB() {
  const db = await getDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      mobileNumber TEXT NOT NULL,
      birthDay TEXT NOT NULL,
      gender TEXT NOT NULL,
      userName TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      photoUri TEXT,
      cloudId TEXT,
      synced INTEGER DEFAULT 0
    );
  `);
  console.log('✅ SQLite: users table ready');
}

// --- SAVE NEW USER ---
export async function saveUser(user) {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO users 
      (firstName, lastName, email, mobileNumber, birthDay, gender, userName, password, photoUri)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.firstName,
      user.lastName,
      user.email,
      user.mobileNumber,
      user.birthDay,
      user.gender,
      user.userName,
      user.password,
      user.photoUri || null
    ]
  );
  console.log('✅ SQLite: user saved locally');
}

// --- GET USER BY USERNAME + PASSWORD (LOGIN) ---
export async function getUserByCredentials(userName, password) {
  const db = await getDB();
  const result = await db.getAllAsync(
    `SELECT * FROM users WHERE userName = ? AND password = ? LIMIT 1`,
    [userName, password]
  );
  return result.length > 0 ? result[0] : null;
}

// --- GET ALL USERS (for debugging or sync) ---
export async function getAllUsers() {
  const db = await getDB();
  const result = await db.getAllAsync(`SELECT * FROM users`);
  return result;
}

// --- GET FIRST USER (for Profile screen) ---
export async function getFirstUser() {
  const db = await getDB();
  const result = await db.getAllAsync(`SELECT * FROM users LIMIT 1`);
  return result.length > 0 ? result[0] : null;
}

// --- DELETE ALL USERS (optional, for logout reset) ---
export async function deleteAllUsers() {
  const db = await getDB();
  await db.runAsync(`DELETE FROM users`);
  console.log('🗑️ All users deleted from SQLite');
}

// --- UPDATE USER SYNC STATUS (optional for cloud sync) ---
export async function markUserSynced(userId, cloudId) {
  const db = await getDB();
  await db.runAsync(`UPDATE users SET synced = 1, cloudId = ? WHERE id = ?`, [cloudId, userId]);
  console.log(`☁️ User ${userId} marked as synced`);
}
