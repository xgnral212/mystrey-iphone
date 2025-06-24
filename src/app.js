// ... (����� ������ �� app.js)

// ������� ������ ��������
const authRoutes = require('./routes/authRoutes');
// ������� ������ Tweta � ClubChat ������

// ������� ������ ��������
app.use('/api/auth', authRoutes);

// ... (���� app.js)
require('dotenv').config(); // ����� ������� ������ �� ��� .env
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ����� ������ �������� MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('�� ������� ������ ������ MongoDB �����!'))
    .catch(err => console.error('��� �� ������� ������ ������ MongoDB:', err));

// ����� ������� JSON �� �������
app.use(express.json());

// ����� ���� ������� ������� �� ���� 'public'
app.use(express.static(path.join(__dirname, '../public')));

// ���� ������� (���� HTML ��������)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ��� ����� ������ ��� API ������ ������ ����� ���
// ���� ���� ����� API (���� ������ ������)
app.get('/api/test', (req, res) => {
    res.json({ message: '������ �� API!' });
});

// ��� ����� ������
app.listen(PORT, () => {
    console.log(`������ ���� ��� ������: http://localhost:${PORT}`);
});