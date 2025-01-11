const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/createpatient', dataController.createPatient);

router.get('/retrievepatient', dataController.getPatients);

router.get('/dietchart', dataController.viewDietCharts);

router.get('/viewpatient/:regid', dataController.viewPatient);

router.post('/updatepatient/:regid', dataController.updatePatient);

router.get('/deletepatient/:regid', dataController.deletePatient);

router.get('/viewprofile/:id', dataController.viewProfile);

module.exports = router;
