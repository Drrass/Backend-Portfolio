const mongoose = require('mongoose');

const UserFeedbackSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true },
});

module.exports = mongoose.model('UserFeedback', UserFeedbackSchema);
