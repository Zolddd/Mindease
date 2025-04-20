const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const ContactForm = require('./models/ContactForm');
const User = require('./models/User');
const formRoutes = require('./routes/formRoutes'); 



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/form', formRoutes);


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mindease', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes

// Contact Form Submission
app.post('/contact', async (req, res) => {
  try {
    const contact = new ContactForm(req.body);
    await contact.save();
    res.send('Contact form submitted successfully!');
  } catch (err) {
    res.status(500).send('Error submitting contact form.');
  }
});

app.post('/login', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Existing user - check password
      if (user.password === password) {
        return res.redirect('/index.html?message=login-success');
      } else {
        return res.redirect('/login.html?error=Incorrect%20password');
      }
    } else {
      // New user - sign up
      if (!name || name.trim() === '') {
        return res.redirect('/login.html?error=If%20you%20have%20already%20signed%20up%2C%20please%20enter%20the%20correct%20details.%20If%20you%20have%20not%20already%20signed%20up%2C%20you%20will%20need%20to%20sign%20up%20first.');
      }
      
      

      const newUser = new User({ name, email, password });
      await newUser.save();
      return res.redirect('/index.html?message=signup-success');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Login or registration error');
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
