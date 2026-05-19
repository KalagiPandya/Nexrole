const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  skillScore: { type: Number, default: 0 },
  expScore:   { type: Number, default: 0 },
  perfScore:  { type: Number, default: 0 },
  certScore:  { type: Number, default: 0 },
  finalScore: { type: Number, default: 0 },
  status:     { type: String, enum: ['pending','shortlisted','rejected','approved'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);