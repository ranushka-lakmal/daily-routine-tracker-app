import * as SQLite from 'expo-sqlite';

let dbInstance = null;

export async function getDB() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('drt.db');
  }
  return dbInstance;
}

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
}

export async function saveUser(user) {
  const db = await getDB();
  await db.runAsync(
    `INSERT INTO users (firstName, lastName, email, mobileNumber, birthDay, gender, userName, password, photoUri)
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
}
