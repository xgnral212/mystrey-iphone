const express = require('express');
const router = express.Router();
const ClubChatSnap = require('../models/ClubChatSnap');
const ClubChatMessage = require('../models/ClubChatMessage');
const User = require('../models/User'); // ����� ������ ��������

// ���� ����� ���� �� �����
router.post('/snaps', async (req, res) => {
    try {
        const { userId, mediaUrl, mediaType, isStory } = req.body;
        // �� ����� ����� ���� ��� ������� ����� ������� ��� ���� ����� �����
        // �� ��� ������ (mediaUrl) �� ����� ��������.
        
        const newSnap = new ClubChatSnap({
            userId,
            mediaUrl,
            mediaType,
            isStory,
            // ��� ���� ����� ����� ����� ������ ������ ��� 24 ����
            expiresAt: isStory ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined
        });
        await newSnap.save();
        res.status(201).json({ message: '�� ��� ������/������� �����!', snap: newSnap });
    } catch (error) {
        res.status(500).json({ message: '��� �� ��� ������/�������', error: error.message });
    }
});

// ���� ��� �������� ��������
router.get('/stories', async (req, res) => {
    try {
        const { userId } = req.query; // �������� ������ ���� ������ �������
        const user = await User.findById(userId).select('snapchatFriends');
        if (!user) {
            return res.status(404).json({ message: '�������� ��� �����' });
        }

        // ��� �������� �� �������� (��� ����� �������� �������� �������� ������ MongoDB)
        const friendsStories = await ClubChatSnap.find({
            userId: { $in: user.snapchatFriends },
            isStory: true,
            expiresAt: { $gt: new Date() } // ������ �� ���� �� ����� �������� ���
        })
        .populate('userId', 'username profilePicture')
        .sort({ createdAt: -1 });

        res.status(200).json(friendsStories);
    } catch (error) {
        res.status(500).json({ message: '��� �� ��� ��������', error: error.message });
    }
});

// ���� ����� ����� �����
router.post('/chats/message', async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body; // ������ �����
        // ���� �� ���� ���� chatId ������ ��������� ��������
        const newChatMessage = new ClubChatMessage({ senderId, receiverId, content });
        await newChatMessage.save();

        // �� ����� ����� ��� ������� Socket.IO ������ ������� ����� ��������
        // io.to(receiverId).emit('newMessage', newChatMessage);

        res.status(201).json({ message: '�� ����� ������� �����!', message: newChatMessage });
    } catch (error) {
        res.status(500).json({ message: '��� �� ����� �������', error: error.message });
    }
});

// ���� ��� ����� ����� ��� ��������
router.get('/chats/:userId1/:userId2/messages', async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;
        // ��� ������� ��� ���������� ������ ����
        const messages = await ClubChatMessage.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: '��� �� ��� �������', error: error.message });
    }
});

// ���� ����� ���� (����� ��� �����)
router.post('/users/:id/add-friend', async (req, res) => {
    try {
        const { currentUserId } = req.body; // �������� ���� ���� ��� �������
        const friendId = req.params.id; // �������� ���� ��� ����� ����� ����

        // ���� �� �� ���������� �������
        const currentUser = await User.findById(currentUserId);
        const friendUser = await User.findById(friendId);

        if (!currentUser || !friendUser) {
            return res.status(404).json({ message: '��� ���������� ��� �����' });
        }

        // ���� ����� ����� ����� ����� ������� �������
        if (currentUserId === friendId || currentUser.snapchatFriends.includes(friendId)) {
            return res.status(400).json({ message: '�� ���� ����� ��� �������� �����' });
        }

        // �� ����� ����� ����� ���� ���� ������ ������� (����ɡ ������)
        // ��� ���� ������ء ������� ������� ������
        currentUser.snapchatFriends.push(friendId);
        friendUser.snapchatFriends.push(currentUserId);

        await currentUser.save();
        await friendUser.save();

        res.status(200).json({ message: '��� ����� ������ �����!' });

    } catch (error) {
        res.status(500).json({ message: '��� �� ����� ������', error: error.message });
    }
});

module.exports = router;