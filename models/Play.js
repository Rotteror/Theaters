const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, maxLength: [50, 'Symbols cannot be more than 50'] },
    imageUrl: { type: String, required: true },
    isPublic: { type: Boolean, required: true },
    createdAt: { type: Data, required: true, default: Date.now },
    userLikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});


module.exports = model('Play', schema);
