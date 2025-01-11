const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const flash = require('connect-flash');
const db = require('./config/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const session = require('express-session');
const passport = require('passport');
const app = express();
const helpers = require('handlebars-helpers')();

require('./config/passport')(passport);
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: helpers,
    formatDate: function (date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');


app.use('/', authRoutes);
app.use('/', patientRoutes);

app.use('/forgot-password', authRoutes);

app.use(express.static('public'));

// Define the root route
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


