const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Contact form schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Login schema (Note: For real apps, hash passwords!)
const loginSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Login = mongoose.model('Login', loginSchema);

// Contact form route
router.post('/contact', async (req, res) => {
  console.log('Form submitted:', req.body);
  try {
    const contactData = new Contact(req.body);
    await contactData.save();
    res.send('Contact form submitted successfully!');
  } catch (error) {
    console.error('Error saving to DB:', error); 
    res.status(500).send('Error submitting contact form.');
  }
});

module.exports = router;
