const express = require('express');
const router = express.Router();
const TwetaPost = require('../models/TwetaPost');
const User = require('../models/User'); // äÍÊÇÌ áäãæĞÌ ÇáãÓÊÎÏã ááÑÈØ

// ãÓÇÑ äÔÑ ÊÛÑíÏÉ ÌÏíÏÉ
router.post('/posts', async (req, res) => {
    try {
        const { userId, content, image } = req.body;
        // åäÇ íÌÈ Ãä íßæä åäÇß ÊÍŞŞ ãä Ãä ÇáãÓÊÎÏã ãÕÇÏŞ Úáíå
        const newPost = new TwetaPost({ userId, content, image });
        await newPost.save();
        res.status(201).json({ message: 'Êã äÔÑ ÇáÊÛÑíÏÉ ÈäÌÇÍ!', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'ÎØÃ İí äÔÑ ÇáÊÛÑíÏÉ', error: error.message });
    }
});

// ãÓÇÑ ÇáÍÕæá Úáì ÇáÊÛÑíÏÇÊ (ÇáÎáÇÕÉ)
router.get('/posts', async (req, res) => {
    try {
        // íãßä ÅÖÇİÉ ãäØŞ áÊÕİíÉ ÇáÊÛÑíÏÇÊ ÍÓÈ ÇáãÓÊÎÏã Ãæ ÇáÚÑÖ ÇáÃßËÑ ÔíæÚğÇ
        const posts = await TwetaPost.find()
            .populate('userId', 'username profilePicture') // áÌáÈ ÇÓã ÇáãÓÊÎÏã æÕæÑÊå
            .sort({ createdAt: -1 }); // ÃÍÏË ÇáÊÛÑíÏÇÊ ÃæáÇğ
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'ÎØÃ İí ÌáÈ ÇáÊÛÑíÏÇÊ', error: error.message });
    }
});

// ãÓÇÑ ÇáÅÚÌÇÈ ÈÊÛÑíÏÉ
router.post('/posts/:id/like', async (req, res) => {
    try {
        const { userId } = req.body; // ÇáãÓÊÎÏã ÇáĞí ŞÇã ÈÇáÅÚÌÇÈ
        const postId = req.params.id;

        const post = await TwetaPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'ÇáÊÛÑíÏÉ ÛíÑ ãæÌæÏÉ' });
        }

        // ÇáÊÍŞŞ ããÇ ÅĞÇ ßÇä ÇáãÓÊÎÏã ŞÏ ÃÚÌÈ ÈÇáİÚá
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // ÅÒÇáÉ ÇáÅÚÌÇÈ ÅĞÇ ßÇä ãæÌæÏğÇ
            post.likes = post.likes.filter(id => id.toString() !== userId);
            await post.save();
            res.status(200).json({ message: 'Êã ÅáÛÇÁ ÇáÅÚÌÇÈ ÈäÌÇÍ!', post });
        } else {
            // ÅÖÇİÉ ÅÚÌÇÈ
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: 'Êã ÇáÅÚÌÇÈ ÈäÌÇÍ!', post });
        }
    } catch (error) {
        res.status(500).json({ message: 'ÎØÃ İí ÇáÅÚÌÇÈ ÈÇáÊÛÑíÏÉ', error: error.message });
    }
});

// ãÓÇÑ ÇáÑÏ Úáì ÊÛÑíÏÉ
router.post('/posts/:id/reply', async (req, res) => {
    try {
        const { userId, content } = req.body;
        const postId = req.params.id;

        const post = await TwetaPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'ÇáÊÛÑíÏÉ ÛíÑ ãæÌæÏÉ' });
        }

        post.replies.push({ userId, content });
        await post.save();
        res.status(201).json({ message: 'Êã ÇáÑÏ Úáì ÇáÊÛÑíÏÉ ÈäÌÇÍ!', post });
    } catch (error) {
        res.status(500).json({ message: 'ÎØÃ İí ÇáÑÏ Úáì ÇáÊÛÑíÏÉ', error: error.message });
    }
});


module.exports = router;