const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  department:     { type: String, required: true },
  description:    { type: String, required: true },
  requiredSkills: [{ type: String }],
  minExperience:  { type: Number, default: 0 },
  postedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isOpen:         { type: Boolean, default: true },
  deadline:       { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);