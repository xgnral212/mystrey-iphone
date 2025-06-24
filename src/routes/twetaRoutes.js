const express = require('express');
const router = express.Router();
const TwetaPost = require('../models/TwetaPost');
const User = require('../models/User'); // ����� ������ �������� �����

// ���� ��� ������ �����
router.post('/posts', async (req, res) => {
    try {
        const { userId, content, image } = req.body;
        // ��� ��� �� ���� ���� ���� �� �� �������� ����� ����
        const newPost = new TwetaPost({ userId, content, image });
        await newPost.save();
        res.status(201).json({ message: '�� ��� �������� �����!', post: newPost });
    } catch (error) {
        res.status(500).json({ message: '��� �� ��� ��������', error: error.message });
    }
});

// ���� ������ ��� ��������� (�������)
router.get('/posts', async (req, res) => {
    try {
        // ���� ����� ���� ������ ��������� ��� �������� �� ����� ������ ������
        const posts = await TwetaPost.find()
            .populate('userId', 'username profilePicture') // ���� ��� �������� ������
            .sort({ createdAt: -1 }); // ���� ��������� �����
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: '��� �� ��� ���������', error: error.message });
    }
});

// ���� ������� �������
router.post('/posts/:id/like', async (req, res) => {
    try {
        const { userId } = req.body; // �������� ���� ��� ��������
        const postId = req.params.id;

        const post = await TwetaPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '�������� ��� ������' });
        }

        // ������ ��� ��� ��� �������� �� ���� ������
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // ����� ������� ��� ��� �������
            post.likes = post.likes.filter(id => id.toString() !== userId);
            await post.save();
            res.status(200).json({ message: '�� ����� ������� �����!', post });
        } else {
            // ����� �����
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: '�� ������� �����!', post });
        }
    } catch (error) {
        res.status(500).json({ message: '��� �� ������� ���������', error: error.message });
    }
});

// ���� ���� ��� ������
router.post('/posts/:id/reply', async (req, res) => {
    try {
        const { userId, content } = req.body;
        const postId = req.params.id;

        const post = await TwetaPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '�������� ��� ������' });
        }

        post.replies.push({ userId, content });
        await post.save();
        res.status(201).json({ message: '�� ���� ��� �������� �����!', post });
    } catch (error) {
        res.status(500).json({ message: '��� �� ���� ��� ��������', error: error.message });
    }
});


module.exports = router;