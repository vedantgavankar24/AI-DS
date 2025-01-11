const User = require('../models/Staff');
const Patient = require('../models/Patient');
const DietChart = require('../models/Dietchart'); 
const Delivery = require('../models/Delivery'); 
const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const { sendVerificationEmail } = require('../utils/email');
const { sendPasswordResetEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const {username, email, password, role } = req.body;
  try {
    const existingUsernorem = await User.findOne({ $or: [{ username }, { email }] });
    if(existingUsernorem) {
      const existingUser = await User.findOne({ username , email });

      if(existingUser) {
        res.render('alreadyExists');
      } else {
        const existingUser1 = await User.findOne({ username });
        const existingUser2 = await User.findOne({ email });
        if(existingUser1) {
          res.render('unExists');
        } else if(existingUser2) {
          res.render('eExists');
        }
      } 
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      res.render('registrationSuccess');
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

};

exports.registerpatient = async (req, res) => {
  const {
    regid,
    name, 
    age,
    gender,
    bloodgroup,
    roomNumber,
    floorNumber,
    bedNumber,
    diseases,
    allergies,
    contact,
    emergencyContact, } = req.body;
  try {
    const existingUsernorem = await Patient.findOne({ regid });
    if(existingUsernorem) {
        res.render('alreadyExists');
    } else {
      const newPatient = new Patient({
        regid,
        name, 
        age,
        gender,
        bloodgroup,
        roomNumber,
        floorNumber,
        bedNumber,
        diseases,
        allergies,
        contact,
        emergencyContact,
      });

      await newPatient.save();

      res.render('registrationSuccess');
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

exports.addDietChart = async (req, res) => {
  const { regid, morningMeal, afternoonMeal, eveningMeal } = req.body;

  try {
    const existingDietChart = await DietChart.findOne({ regid });
    if (existingDietChart) {
      return res.status(400).json({ message: 'Diet chart already exists for this patient.' });
    }

    const newDietChart = new DietChart({
      regid,
      morningMeal,
      afternoonMeal,
      eveningMeal,
    });

    await newDietChart.save();

    res.status(201).json({ message: 'Diet chart added successfully.', data: newDietChart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while adding the diet chart.' });
  }
};

exports.addDeliverymethod = async (req, res) => {
  const { regid,
    dietChartId,
    prepPersonId,
    deliveryPersonId,
    mealType,
    prepTime,
    deliveryTime,
    prepstatus,
    deliverystatus,
    notes, } = req.body;

  try {
    const existingDelivery = await Delivery.findOne({ regid });
    if (existingDelivery) {
      return res.status(400).json({ message: 'Delivery plan already exists for this patient meal.' });
    }

    const newDelivery = new Delivery({
      regid,
      dietChartId,
      prepPersonId,
      deliveryPersonId,
      mealType,
      prepTime,
      deliveryTime,
      prepstatus,
      deliverystatus,
      notes,
    });

    await newDelivery.save();

    res.status(201).json({ message: 'Delievry scheduled successfully.', data: newDietChart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while scheduling this delivery.' });
  }
};

exports.removeDeliverymethod = async (req, res) => {
  const { regid } = req.body;
  try {
    const existingUser = await Delivery.findOne({ regid });
    if(existingUser) {
        await existingUser.deleteOne();
    } else {
      res.render('registrationSuccess');
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removepatient = async (req, res) => {
  const { regid } = req.body;
  try {
    const existingUsernorem = await Patient.findOne({ regid });
    if(existingUsernorem) {
        await existingUsernorem.deleteOne();
    } else {
      res.render('registrationSuccess');
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    if(user.role == 'Manager') {
      res.render('fmdashboard', {
        username: user.username,
      });
    }
    else {
      res.render('dashboard', {
        _id: user._id,
        username: user.username,
        role: user.role,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const { identifier } = req.body;

  try {
      // Find user by username or email
      const user = await User.findOne({
          $or: [{ username: identifier }, { email: identifier }]
      });

      if (!user) {
        res.render('userdnexist');
      } else {
          await sendPasswordResetEmail(user.email, user.username);
          res.render('passresetmailsent');
      }
  } catch (err) {
      console.error('Password reset error:', err);
      res.status(500).json({ error: err.message });
      //return res.status(500).json({ error: 'Internal server error' });
    
  }
};

exports.showResetPasswordForm = async (req, res) => {
  const { username } = req.params;
  try {
    const userid = await User.findOne({ username: username});
    if(!userid) {
      res.render('userdnexist');
    } else {
      res.render('reset-password', { userid });
    }
  } catch (error) {
      console.error('Error rendering password reset form:', error);
      res.status(500).send('Internal server error');
  }
};

exports.resetPassword = async (req, res) => {
  const { userid } = req.params;
  const { password, confirmPassword } = req.body;

  try {
      const user = await User.findOne({ id: userid  });

      if (!user) {
        res.render('userdnexist');
      } else {

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();

        res.render('password-reset-success');
      }
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).send('Internal server error');
  }
};

exports.dashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.render('dashboard', { username: req.user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.logoutUser = (req, res) => {
  req.logout(err => {
      if (err) {
          console.error(err);
      }
      res.redirect('/');
  });
};

