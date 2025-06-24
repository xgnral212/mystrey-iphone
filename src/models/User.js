const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // ÌÃ»  ‘›Ì— ﬂ·„… «·„—Ê— ›Ì «· ÿ»Ìﬁ «·ÕﬁÌﬁÌ
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    // Œ’«∆’ ≈÷«›Ì… ·”‰«» ‘«  («·” —Ìﬂ° «·√’œﬁ«¡)
    snapchatFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    snapchatStreaks: [{
        friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        count: { type: Number, default: 0 },
        lastSnapTime: { type: Date }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);