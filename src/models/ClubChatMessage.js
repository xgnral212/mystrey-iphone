const mongoose = require('mongoose');

const clubChatMessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ��� ���� ����� �����
    chatId: { type: String }, // ���� ������� (���� �� ���� ��� ��������)
    content: { type: String, required: true },
    mediaUrl: { type: String }, // �����/���������� �� �������
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClubChatMessage', clubChatMessageSchema);