// db.js
const { Pool } = require('pg');
require('dotenv').config(); // Asegurate de tener un .env si querés usar variables de entorno

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',       // Reemplazá 'tuUsuario' por tu usuario de PostgreSQL
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'rec_definitivo', // Nombre de tu base de datos
  password: process.env.DB_PASSWORD || '1043978875', // Reemplazá 'tuPassword' por tu contraseña
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
