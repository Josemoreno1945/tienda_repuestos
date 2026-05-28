const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

let dbPromise = null;

async function initDb() {
  // 1. Determinar la ruta final del archivo
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');
  // 2. Extraer solo la ruta de la carpeta (ignorando el nombre del archivo)
  const dbDir = path.dirname(dbPath);
  // 3. Crear la carpeta si no existe (Esto soluciona el error SQLITE_CANTOPEN en Render)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log(`📂 Directorio de base de datos creado en: ${dbDir}`);
  }
  // 4. Abrir conexión a la base de datos
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // --- SCRIPT DDL: CREACIÓN DE TABLAS ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'client'
    );

    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        category TEXT,
        compatibility TEXT,
        status TEXT NOT NULL DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        customerName TEXT,
        customerEmail TEXT,
        shippingAddress TEXT,
        phone TEXT,
        products TEXT,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        transactionId TEXT,
        date TEXT,
        FOREIGN KEY (userId) REFERENCES users (id)
    );
  `);

  // --- MIGRACIÓN DE ESQUEMA PARA BASES DE DATOS EXISTENTES ---
  try {
    // Añadir columna status si no existe
    const columnsInfo = await db.all("PRAGMA table_info(products)");
    const hasStatus = columnsInfo.some(col => col.name === 'status');
    if (!hasStatus) {
      await db.exec("ALTER TABLE products ADD COLUMN status TEXT NOT NULL DEFAULT 'active'");
      console.log('📦 Columna "status" añadida a la tabla products exitosamente.');
    }
  } catch (error) {
    console.error('Error alterando esquema:', error);
  }

  // --- MIGRACIÓN DE DATOS DESDE db.json ---
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    try {
      const dbJsonPath = path.join(__dirname, '../../db.json');
      if (fs.existsSync(dbJsonPath)) {
        const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

        if (data.users) {
          for (const u of data.users) {
            await db.run('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
              [u.id, u.name, u.email, u.password, u.role]);
          }
        }

        if (data.products) {
          for (const p of data.products) {
            await db.run('INSERT INTO products (id, name, description, price, stock, image, category, compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [p.id, p.name, p.description, p.price, p.stock, p.image, p.category, p.compatibility]);
          }
        }
        console.log('📦 Datos migrados de db.json a SQLite exitosamente.');
      }
    } catch (error) {
      console.error('Error migrando datos:', error);
    }
  }

  return db;
}

// Singleton para reusar la conexión
function getDb() {
  if (!dbPromise) {
    dbPromise = initDb();
  }
  return dbPromise;
}

module.exports = { getDb };
