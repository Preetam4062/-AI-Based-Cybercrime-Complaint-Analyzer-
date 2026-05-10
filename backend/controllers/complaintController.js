const Complaint = require('../models/Complaint');

// @desc    Get all complaints for logged-in user
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Submit a new complaint and analyze it
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const { incidentType, description } = req.body;

    // Simulate AI Analysis to generate confidence score and categorization
    // In production, this would call OpenAI or Anthropic API
    const aiConfidenceScore = Math.floor(Math.random() * (99 - 70 + 1) + 70); // Mock 70-99%

    const complaint = await Complaint.create({
      user: req.user.id,
      incidentType,
      description,
      status: 'Under Review',
      aiConfidenceScore
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/complaints/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });
    
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const pending = complaints.filter(c => c.status !== 'Resolved').length;
    
    // Calculate incidents by type for pie chart
    const typeCounts = complaints.reduce((acc, curr) => {
      acc[curr.incidentType] = (acc[curr.incidentType] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(typeCounts).map(key => ({
      name: key,
      value: typeCounts[key]
    }));

    // If no data, send mock data so the dashboard doesn't look empty
    const finalChartData = chartData.length > 0 ? chartData : [
      { name: 'Phishing', value: 12 },
      { name: 'Malware', value: 8 },
      { name: 'Data Breach', value: 5 }
    ];

    res.status(200).json({
      success: true,
      data: {
        total: total === 0 ? 1204 : total, // Fake stats if empty
        resolved: total === 0 ? 87 : resolved,
        pending: total === 0 ? 15 : pending,
        chartData: finalChartData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
