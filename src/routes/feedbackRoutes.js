const express = require('express');
const { createFeedback, getFeedbacks, upvoteFeedback, downvoteFeedback, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', authMiddleware, upload.single('file'), createFeedback);
router.get('/', getFeedbacks);
router.post('/:id/upvote', authMiddleware, upvoteFeedback);
router.post('/:id/downvote', authMiddleware, downvoteFeedback);
router.put('/:id', authMiddleware, updateFeedback);
router.delete('/:id', authMiddleware, deleteFeedback);

module.exports = router;
