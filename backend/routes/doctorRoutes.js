const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctors');
const nodemailer = require('nodemailer');

// Get all doctors
router.get("/all", async (req, res) => {
    try {
        const entries = await Doctor.find({});
        res.json(entries);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Fetch doctors by disease
router.get('/:disease', async (req, res) => {
    try {
        const doctorEntry = await Doctor.findOne({ disease: req.params.disease });
        if (!doctorEntry) return res.status(404).json({ message: "No doctor found." });
        res.json(doctorEntry);
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

// Add new doctor entry
router.post('/add', async (req, res) => {
    try {
        const { disease, specialization, symptoms, doctors } = req.body;
        
        // Check if disease already exists
        const existingDisease = await Doctor.findOne({ disease });
        if (existingDisease) {
            return res.status(400).json({ 
                success: false, 
                message: 'Disease already exists' 
            });
        }

        const newDoctorEntry = new Doctor({
            disease,
            specialization,
            symptoms,
            doctors
        });

        await newDoctorEntry.save();
        res.status(201).json({ success: true, message: 'Doctors added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update specific doctor
router.put('/update/:id/:docIndex', async (req, res) => {
    try {
        const { id, docIndex } = req.params;
        const { doctor } = req.body;

        const doctorEntry = await Doctor.findById(id);
        if (!doctorEntry) {
            return res.status(404).json({ success: false, message: 'Doctor entry not found' });
        }

        doctorEntry.doctors[docIndex] = {
            ...doctorEntry.doctors[docIndex],
            ...doctor
        };

        await doctorEntry.save();
        res.json({ success: true, message: 'Doctor updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Send email route
router.post('/send', async (req, res) => {
    const { 
        doctorEmail, 
        userName, 
        userEmail,
        disease, 
        patientDetails 
    } = req.body;

    console.log("EMAIL SEND BODY:", req.body);

    if (!doctorEmail || !doctorEmail.includes("@")) {
        return res.status(400).json({ success: false, message: "Valid doctor email required" });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    // Create a formatted email body
    const emailBody = `
        New Patient Report

        Patient Details:
        Name: ${userName}
        Email: ${userEmail}
        Age: ${patientDetails.age}
        Gender: ${patientDetails.gender}

        Medical Information:
        Predicted Disease: ${disease}
        Reported Symptoms: ${patientDetails.symptoms}

        Patient's Description:
        ${patientDetails.feeling}

        Mood Analysis: ${patientDetails.sentiment}

        Note: This is an automated report from HealthBuddy. Please review and contact the patient for proper diagnosis.
    `;

    const mailOptions = {
        from: process.env.EMAIL,
        to: doctorEmail,
        subject: `New Patient Report - ${userName}`,
        text: emailBody
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        res.json({ success: true, message: "Email sent successfully" });
    } catch (err) {
        console.error("Email Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Failed to send email", 
            error: err.message 
        });
    }
});

// Remove disease
router.delete('/disease/:id', async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Disease removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Remove specific doctor
router.delete('/:id/doctor/:index', async (req, res) => {
    try {
        const doctorEntry = await Doctor.findById(req.params.id);
        if (!doctorEntry) {
            return res.status(404).json({ success: false, message: 'Disease not found' });
        }

        doctorEntry.doctors.splice(req.params.index, 1);
        
        if (doctorEntry.doctors.length === 0) {
            await Doctor.findByIdAndDelete(req.params.id);
        } else {
            await doctorEntry.save();
        }

        res.json({ success: true, message: 'Doctor removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add this route for updating disease info
router.put('/disease/:id', async (req, res) => {
    try {
        const { disease, specialization, symptoms } = req.body;
        const doctorEntry = await Doctor.findById(req.params.id);
        
        if (!doctorEntry) {
            return res.status(404).json({ 
                success: false, 
                message: 'Disease entry not found' 
            });
        }

        doctorEntry.disease = disease;
        doctorEntry.specialization = specialization;
        doctorEntry.symptoms = symptoms;

        await doctorEntry.save();
        res.json({ success: true, message: 'Disease information updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
