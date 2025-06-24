const mongoose = require('mongoose');

const clubChatSnapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true }, // —«»ÿ «·’Ê—…/«·›ÌœÌÊ
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // „‰ ‘«Âœ «·”‰«»
    isStory: { type: Boolean, default: false }, // Â· ÂÊ Ã“¡ „‰ «·” Ê—Ì
    expiresAt: { type: Date }, // Êﬁ  «‰ Â«¡ «·’·«ÕÌ… ··” Ê—Ì √Ê «·”‰«» «·Œ«’
    createdAt: { type: Date, default: Date.now }
});

//  ⁄ÌÌ‰ «‰ Â«¡ ’·«ÕÌ…  ·ﬁ«∆Ì ·‹ "«·” Ê—Ì" »⁄œ 24 ”«⁄…
clubChatSnapSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ClubChatSnap', clubChatSnapSchema);