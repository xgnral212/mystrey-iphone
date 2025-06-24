const express = require('express');
const router = express.Router();
const ClubChatSnap = require('../models/ClubChatSnap');
const ClubChatMessage = require('../models/ClubChatMessage');
const User = require('../models/User'); // ‰Õ «Ã ·‰„Ê–Ã «·„” Œœ„

// „”«—  Õ„Ì· ”‰«» √Ê ” Ê—Ì
router.post('/snaps', async (req, res) => {
    try {
        const { userId, mediaUrl, mediaType, isStory } = req.body;
        // ›Ì  ÿ»Ìﬁ ÕﬁÌﬁÌ° ”Ì „ Â‰« «” ﬁ»«· «·„·› Ê Õ„Ì·Â ≈·Ï Œœ„…  Œ“Ì‰ ”Õ«»Ì
        // À„ Õ›Ÿ «·—«»ÿ (mediaUrl) ›Ì ﬁ«⁄œ… «·»Ì«‰« .
        
        const newSnap = new ClubChatSnap({
            userId,
            mediaUrl,
            mediaType,
            isStory,
            // ≈–« ﬂ«‰  ” Ê—Ì°  ⁄ÌÌ‰  «—ÌŒ «‰ Â«¡ ’·«ÕÌ… »⁄œ 24 ”«⁄…
            expiresAt: isStory ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined
        });
        await newSnap.save();
        res.status(201).json({ message: ' „ —›⁄ «·”‰«»/«·” Ê—Ì »‰Ã«Õ!', snap: newSnap });
    } catch (error) {
        res.status(500).json({ message: 'Œÿ√ ›Ì —›⁄ «·”‰«»/«·” Ê—Ì', error: error.message });
    }
});

// „”«— Ã·» «·” Ê—Ì“ ··√’œﬁ«¡
router.get('/stories', async (req, res) => {
    try {
        const { userId } = req.query; // «·„” Œœ„ «·Õ«·Ì ·Ã·» ” Ê—Ì“ √’œﬁ«∆Â
        const user = await User.findById(userId).select('snapchatFriends');
        if (!user) {
            return res.status(404).json({ message: '«·„” Œœ„ €Ì— „ÊÃÊœ' });
        }

        // Ã·» «·” Ê—Ì“ „‰ «·√’œﬁ«¡ (ÌÃ»  ’›Ì… «·” Ê—Ì“ «·„‰ ÂÌ… «·’·«ÕÌ… »Ê«”ÿ… MongoDB)
        const friendsStories = await ClubChatSnap.find({
            userId: { $in: user.snapchatFriends },
            isStory: true,
            expiresAt: { $gt: new Date() } // «· √ﬂœ „‰ √‰Â« ·„  ‰ ÂÌ ’·«ÕÌ Â« »⁄œ
        })
        .populate('userId', 'username profilePicture')
        .sort({ createdAt: -1 });

        res.status(200).json(friendsStories);
    } catch (error) {
        res.status(500).json({ message: 'Œÿ√ ›Ì Ã·» «·” Ê—Ì“', error: error.message });
    }
});

// „”«— ≈—”«· —”«·… œ—œ‘…
router.post('/chats/message', async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body; // ·—”«·… ›—œÌ…
        // Ì„ﬂ‰ √‰ ÌﬂÊ‰ Â‰«ﬂ chatId ·≈œ«—… «·„Õ«œÀ«  «·Ã„«⁄Ì…
        const newChatMessage = new ClubChatMessage({ senderId, receiverId, content });
        await newChatMessage.save();

        // ›Ì  ÿ»Ìﬁ ÕﬁÌﬁÌ° Â‰« ” ” Œœ„ Socket.IO ·≈—”«· «·—”«·… ›Ê—« ··„” ﬁ»·
        // io.to(receiverId).emit('newMessage', newChatMessage);

        res.status(201).json({ message: ' „ ≈—”«· «·—”«·… »‰Ã«Õ!', message: newChatMessage });
    } catch (error) {
        res.status(500).json({ message: 'Œÿ√ ›Ì ≈—”«· «·—”«·…', error: error.message });
    }
});

// „”«— Ã·» —”«∆· œ—œ‘… »Ì‰ „” Œœ„Ì‰
router.get('/chats/:userId1/:userId2/messages', async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        // Ã·» «·—”«∆· »Ì‰ «·„” Œœ„Ì‰ » — Ì» “„‰Ì
        const messages = await ClubChatMessage.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Œÿ√ ›Ì Ã·» «·—”«∆·', error: error.message });
    }
});

// „”«— ≈÷«›… ’œÌﬁ (≈—”«· ÿ·» ’œ«ﬁ…)
router.post('/users/:id/add-friend', async (req, res) => {
    try {
        const { currentUserId } = req.body; // «·„” Œœ„ «·–Ì Ì—”· ÿ·» «·’œ«ﬁ…
        const friendId = req.params.id; // «·„” Œœ„ «·–Ì Ì „ ≈—”«· «·ÿ·» ≈·ÌÂ

        //  Õﬁﬁ „‰ √‰ «·„” Œœ„Ì‰ „ÊÃÊœÌ‰
        const currentUser = await User.findById(currentUserId);
        const friendUser = await User.findById(friendId);

        if (!currentUser || !friendUser) {
            return res.status(404).json({ message: '√Õœ «·„” Œœ„Ì‰ €Ì— „ÊÃÊœ' });
        }

        //  Ã‰» ≈÷«›… «·‰›” ﬂ’œÌﬁ Ê Ã‰» «·ÿ·»«  «·„ﬂ——…
        if (currentUserId === friendId || currentUser.snapchatFriends.includes(friendId)) {
            return res.status(400).json({ message: '·« Ì„ﬂ‰ ≈÷«›… Â–« «·„” Œœ„ ﬂ’œÌﬁ' });
        }

        // ›Ì  ÿ»Ìﬁ ÕﬁÌﬁÌ° ” ﬂÊ‰ Â‰«ﬂ Õ«·… ·ÿ·»«  «·’œ«ﬁ… („⁄·ﬁ…° „ﬁ»Ê·…)
        // Â‰« ·€—÷ «· »”Ìÿ° ”‰÷Ì›Â„ ﬂ√’œﬁ«¡ „»«‘—…
        currentUser.snapchatFriends.push(friendId);
        friendUser.snapchatFriends.push(currentUserId);

        await currentUser.save();
        await friendUser.save();

        res.status(200).json({ message: ' „  ≈÷«›… «·’œÌﬁ »‰Ã«Õ!' });

    } catch (error) {
        res.status(500).json({ message: 'Œÿ√ ›Ì ≈÷«›… «·’œÌﬁ', error: error.message });
    }
});

module.exports = router;