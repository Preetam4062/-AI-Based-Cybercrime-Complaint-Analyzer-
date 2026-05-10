const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  incidentType: {
    type: String,
    required: [true, 'Please select an incident type'],
    enum: ['Phishing', 'Malware', 'Data Breach', 'Identity Theft', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the incident']
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Resolved'],
    default: 'Pending'
  },
  aiConfidenceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
