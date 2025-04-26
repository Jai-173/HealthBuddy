const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctors');
const nodemailer = require('nodemailer');

router.get("/all", async (req, res) => {
    const entries = await Doctor.find({});
    res.json(entries);
  });
  
  // ADD new disease or append doctors
  router.post("/add", async (req, res) => {
    const { disease, specialization, symptoms, doctors } = req.body;
    try {
      let entry = await Doctor.findOne({ disease });
  
      if (entry) {
        // append new doctors
        entry.doctors.push(...doctors);
        await entry.save();
      } else {
        entry = new Doctor({ disease, specialization, symptoms, doctors });
        await entry.save();
      }
  
      res.status(200).json({ success: true, message: "Doctor(s) added" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  
  // UPDATE a doctor by disease and email
  router.put("/update", async (req, res) => {
    const { disease, email, updatedDoctor } = req.body;
    try {
      const entry = await Doctor.findOne({ disease });
      if (!entry) return res.status(404).json({ error: "Disease not found" });
  
      const index = entry.doctors.findIndex(doc => doc.email === email);
      if (index === -1) return res.status(404).json({ error: "Doctor not found" });
  
      entry.doctors[index] = { ...entry.doctors[index], ...updatedDoctor };
      await entry.save();
  
      res.status(200).json({ success: true, message: "Doctor updated" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  
  // DELETE a doctor by disease and email
  router.delete("/delete", async (req, res) => {
    const { disease, email } = req.body;
    try {
      const entry = await Doctor.findOne({ disease });
      if (!entry) return res.status(404).json({ error: "Disease not found" });
  
      entry.doctors = entry.doctors.filter(doc => doc.email !== email);
      await entry.save();
  
      res.status(200).json({ success: true, message: "Doctor removed" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
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

// Send email to doctor
router.post('/send', async (req, res) => {
    const { doctorEmail, userName, disease } = req.body;
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

    const mailOptions = {
        from: process.env.EMAIL,
        to: doctorEmail,
        subject: `New Patient Report - ${userName}`,
        text: `${userName} has been predicted to have ${disease}. Please follow up.`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        res.json({ success: true, message: "Email sent successfully" });
    } catch (err) {
        console.error("Email Error:", err);
        res.status(500).json({ success: false, message: "Failed to send email", error: err.message });
    }
});



module.exports = router;
