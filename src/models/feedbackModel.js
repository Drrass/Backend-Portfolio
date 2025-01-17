const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    topic: { type: String, required: true },
    file: { type: String },
    upvote: { type: Number, default: 0 },
    downvote: { type: Number, default: 0 },
    topic: { type: String, enum: ['General', 'Cli/Git', 'Dataset', 'Asynchronous JS/Callback', 'CSS Battle', 'DOM', 'React'], required: true },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    postedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
