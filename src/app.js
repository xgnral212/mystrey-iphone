// ... (ַבֱּׂ ַבÚבזם דה app.js)

// ַ׃Êםַֿׁ ד׃ַַׁÊ ַבדױַֿÞֹ
const authRoutes = require('./routes/authRoutes');
// ַ׃Êםַֿׁ ד׃ַַׁÊ Tweta ז ClubChat בַֽÞַנ

// ַ׃Ê־ַֿד ד׃ַַׁÊ ַבדױַֿÞֹ
app.use('/api/auth', authRoutes);

// ... (ָÞםֹ app.js)
require('dotenv').config(); // Êֽדםב דÊÛםַׁÊ ַבָםֶֹ דה דבÝ .env
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Êזױםב ָÞַÚֹֿ ַבָםַהַÊ MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Êד ַבַÊױַב ָÞַÚֹֿ ָםַהַÊ MongoDB ָהַּֽ!'))
    .catch(err => console.error('־״ֳ Ýם ַבַÊױַב ָÞַÚֹֿ ָםַהַÊ MongoDB:', err));

// ÊÝÚםב ַ׃Ê־ַֿד JSON Ýם ַב״בַָÊ
app.use(express.json());

// ÊÝÚםב ־ֿדֹ ַבדבÝַÊ ַבַָֻÊֹ דה דּבֿ 'public'
app.use(express.static(path.join(__dirname, '../public')));

// ד׃ַׁ ַÝÊַׁײם (ױÝֹֽ HTML ַבֶׁם׃םֹ)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// והַ ׃הײםÝ ד׃ַַׁÊ ַבÜ API ַב־ַױֹ ָÊזםÊׁ ז׃הַָ װַÊ
// דַֻב ָ׃ם״ בד׃ַׁ API (׃םÊד Ê״זםׁו בַֽÞַנ)
app.get('/api/test', (req, res) => {
    res.json({ message: 'דַָֽׁנ דה API!' });
});

// ֱָֿ ÊװÛםב ַבד־ֿד
app.listen(PORT, () => {
    console.log(`ַבד־ֿד םÚדב Úבל ַבדהÝ׀: http://localhost:${PORT}`);
});