const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ÓäÍÊÇÌ áäãæĞÌ ÇáãÓÊÎÏã
// ÓäÍÊÇÌ Åáì ãßÊÈÉ áÊÔİíÑ ßáãÇÊ ÇáãÑæÑ (ãËá bcrypt) æãßÊÈÉ JWT áÇÍŞğÇ

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // åäÇ íÌÈ ÊÔİíÑ ßáãÉ ÇáãÑæÑ ŞÈá ÍİÙåÇ
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Êã ÊÓÌíá ÇáãÓÊÎÏã ÈäÌÇÍ!' });
    } catch (error) {
        res.status(500).json({ message: 'ÎØÃ İí ÇáÊÓÌíá', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'ÇáãÓÊÎÏã ÛíÑ ãæÌæÏ' });
        }
        // åäÇ íÌÈ ãŞÇÑäÉ ßáãÉ ÇáãÑæÑ ÇáãÔİÑÉ
        if (user.password !== password) { // íÌÈ ÇÓÊÈÏÇá åĞÇ ÈÇáÊÍŞŞ ãä ßáãÉ ÇáãÑæÑ ÇáãÔİÑÉ
            return res.status(401).json({ message: 'ßáãÉ ÇáãÑæÑ ÛíÑ ÕÍíÍÉ' });
        }
        // ÅäÔÇÁ ÑãÒ JWT æÅÚÇÏÊå ááãÓÊÎÏã
        res.status(200).json({ message: 'Êã ÊÓÌíá ÇáÏÎæá ÈäÌÇÍ!', user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'ÎØÃ İí ÊÓÌíá ÇáÏÎæá', error: error.message });
    }
});

module.exports = router;