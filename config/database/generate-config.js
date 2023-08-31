const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Memuat nilai dari file .env ke dalam variabel lingkungan
dotenv.config();

// Mengambil nilai variabel dari file .env
const user = process.env.PGUSER_TEST;
const password = process.env.PGPASSWORD_TEST;
const host = process.env.PGHOST_TEST;
const port = process.env.PGPORT_TEST;
const database = process.env.PGDATABASE_TEST;

// Membentuk objek JSON
const config = {
    user: user,
    password: password,
    host: host,
    port: parseInt(port),  // Konversi port ke tipe integer
    database: database
};

// Menentukan path untuk menyimpan file config.json di samping skrip JavaScript
const configPath = path.join(__dirname, 'test.json');

// Konversi objek JSON menjadi string format JSON
const jsonConfig = JSON.stringify(config, null, 4);

// Menyimpan string JSON ke dalam file config.json
fs.writeFileSync(configPath, jsonConfig);

console.log('Config file generated successfully.');