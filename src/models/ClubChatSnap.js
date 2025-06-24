const mongoose = require('mongoose');

const clubChatSnapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true }, // ���� ������/�������
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // �� ���� ������
    isStory: { type: Boolean, default: false }, // �� �� ��� �� �������
    expiresAt: { type: Date }, // ��� ������ �������� ������� �� ������ �����
    createdAt: { type: Date, default: Date.now }
});

// ����� ������ ������ ������ �� "�������" ��� 24 ����
clubChatSnapSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ClubChatSnap', clubChatSnapSchema);