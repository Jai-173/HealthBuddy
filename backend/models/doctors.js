const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    disease: { type: String, required: true },
    symptoms: [String],
    specialization: { type: String },
    doctors: [
        {
            name: String,
            address: String,
            email: String,
            phone1: String,
            phone2: String,
            website: String
        }
    ]
});

module.exports = mongoose.model('Doctor', DoctorSchema);
