const Feedback = require('../models/feedbackModel');
const UserFeedback = require('../models/userFeedbackModel');
const User = require('../models/userModel');

const createFeedback = async (req, res) => {
    try {
        // Fetch the user to get the username
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { comment, topic } = req.body;
        const feedback = new Feedback({
            userId: req.user.id, // Store user ID instead of username
            name: user.username, // Optionally keep the username for display purposes
            comment,
            topic,
            file: req.file ? req.file.path : undefined,
        });

        await feedback.save();

        // Link feedback to user
        const userFeedback = new UserFeedback({ user: req.user.id, feedback: feedback._id });
        await userFeedback.save();

        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getFeedbacks = async (req, res) => {
    try {
        const { topic, sortBy = 'postedDate', order = 'desc' } = req.query;
        let query = {};

        if (topic) {
            query.topic = topic;
        }

        let sort = {};
        if (sortBy) {
            sort[sortBy] = order === 'asc' ? 1 : -1;
        }

        const feedbacks = await Feedback.find(query).sort(sort);
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const upvoteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        const userIndex = feedback.upvotedBy.indexOf(req.user.id);

        if (userIndex === -1) {
            // User has not upvoted yet, so add their vote
            feedback.upvotedBy.push(req.user.id);
            feedback.upvote += 1;
        } else {
            // User has already upvoted, so remove their vote
            feedback.upvotedBy.splice(userIndex, 1);
            feedback.upvote -= 1;
        }

        await feedback.save();
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const downvoteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        const userIndex = feedback.downvotedBy.indexOf(req.user.id);

        if (userIndex === -1) {
            // User has not downvoted yet, so add their vote
            feedback.downvotedBy.push(req.user.id);
            feedback.downvote += 1;
        } else {
            // User has already downvoted, so remove their vote
            feedback.downvotedBy.splice(userIndex, 1);
            feedback.downvote -= 1;
        }

        await feedback.save();
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        // Ensure the user is the owner of the feedback
        if (feedback.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to edit this feedback" });
        }

        const { comment, topic } = req.body;
        if (comment) feedback.comment = comment;
        if (topic) feedback.topic = topic;

        await feedback.save();
        res.status(200).json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        // Ensure the user is the owner of the feedback
        if (feedback.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this feedback" });
        }

        // Use deleteOne instead of remove
        await Feedback.deleteOne({ _id: feedback._id });
        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createFeedback, getFeedbacks, upvoteFeedback, downvoteFeedback, updateFeedback, deleteFeedback };
