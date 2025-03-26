const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/add-company', adminController.addCompany);
router.put('/companies/:id', adminController.updateCompany);
router.delete('/companies/:id', adminController.deleteCompany);
router.get('/companies', adminController.getCompanies);

// New endpoints for job seekers
router.post('/add-job-seeker', adminController.addJobSeeker);
router.put('/job-seekers/:id', adminController.updateJobSeeker);
router.delete('/job-seekers/:id', adminController.deleteJobSeeker);
router.get('/job-seekers', adminController.getJobSeekers);

module.exports = router;