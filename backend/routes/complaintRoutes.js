const express = require('express');
const { getComplaints, createComplaint, getStats } = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All complaint routes require authentication

router.route('/')
  .get(getComplaints)
  .post(createComplaint);

router.get('/stats', getStats);

module.exports = router;
