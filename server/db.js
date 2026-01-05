import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

// Diagnstico de ruta
import fs from 'fs';
console.log('--- Buscando .env en:', envPath);
if (fs.existsSync(envPath)) {
    console.log('--- .env encontrado correctamente');
} else {
    console.log('--- ERROR: .env NO existe en esa ruta');
}

dotenv.config({ path: envPath });

const { Pool } = pg;

// Debug robusto
const connStr = process.env.DATABASE_URL;
if (!connStr) {
    console.log('--- ERROR: DATABASE_URL no encontrada en .env ---');
} else {
    // Verificamos si la cadena contiene los placeholders
    if (connStr.includes('tu_contrasea_aqu') || connStr.includes('your_password_here')) {
        console.log('--- ADVERTENCIA: La contrasea en .env parece ser el placeholder ---');
    }
    console.log('--- Base de Datos: Intentando conectar... ---');
}

const pool = new Pool({
    connectionString: connStr,
});

// Manejador de errores del pool
pool.on('error', (err) => {
    console.error('--- ERROR INESPERADO DEL POOL ---', err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
