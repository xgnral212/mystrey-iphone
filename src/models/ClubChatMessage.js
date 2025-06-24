const mongoose = require('mongoose');

const clubChatMessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ≈–« ﬂ«‰  —”«·… ›—œÌ…
    chatId: { type: String }, // „⁄—› «·œ—œ‘… (Ì„ﬂ‰ √‰ ÌﬂÊ‰ »Ì‰ „” Œœ„Ì‰)
    content: { type: String, required: true },
    mediaUrl: { type: String }, // ··’Ê—/«·›ÌœÌÊÂ«  ›Ì «·œ—œ‘…
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClubChatMessage', clubChatMessageSchema);