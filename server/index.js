const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

const dbConfig = {
    user: 'sa',
    password: '12345',
    server: '127.0.0.1',
    port: 1433,
    database: 'GimmethelootMain',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(dbConfig);
        console.log('УСПЕШНО ПОДКЛЮЧИЛИСЬ К БАЗЕ!');
    } catch (err) {
        console.error('Ошибка подключения к MS SQL:', err.message);
    }
}
connectDB();

app.get('/api/boxes', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Boxes');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Главная
app.get('/', (req, res) => {
    const files = fs.readdirSync(publicPath);
    const homeFile = files.find(f => f.toLowerCase().includes('01home')) || '01home.html';
    res.sendFile(path.join(publicPath, homeFile));
});

// УМНЫЙ РОУТЕР: Находит файл, даже если в названии запятая или опечатка
app.get('/:page', (req, res) => {
    const requested = req.params.page.replace('.html', '').toLowerCase();
    const files = fs.readdirSync(publicPath);

    // Ищем файл, в имени которого есть номер и название (например "02catalog")
    const matchedFile = files.find(f => f.toLowerCase().replace(',', '.').includes(requested));

    if (matchedFile) {
        res.sendFile(path.join(publicPath, matchedFile));
    } else {
        res.status(404).send(`Файл не найден. Файлы в public: ${files.join(', ')}`);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});