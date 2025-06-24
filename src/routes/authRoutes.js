const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ������ ������ ��������
// ������ ��� ����� ������ ����� ������ (��� bcrypt) ������ JWT ������

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // ��� ��� ����� ���� ������ ��� �����
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: '�� ����� �������� �����!' });
    } catch (error) {
        res.status(500).json({ message: '��� �� �������', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: '�������� ��� �����' });
        }
        // ��� ��� ������ ���� ������ �������
        if (user.password !== password) { // ��� ������� ��� ������� �� ���� ������ �������
            return res.status(401).json({ message: '���� ������ ��� �����' });
        }
        // ����� ��� JWT ������� ��������
        res.status(200).json({ message: '�� ����� ������ �����!', user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: '��� �� ����� ������', error: error.message });
    }
});

module.exports = router;