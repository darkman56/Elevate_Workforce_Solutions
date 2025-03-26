const express = require('express');
const router = express.Router();
const { jobController, authMiddleware, upload } = require('../controllers/jobController');

router.get('/jobs', jobController.getJobs);
router.post('/jobs', authMiddleware, jobController.createJob);
router.put('/jobs/:id', authMiddleware, jobController.updateJob);
router.delete('/jobs/:id', authMiddleware, jobController.deleteJob);
router.get('/dashboard', authMiddleware, jobController.getCompanyDashboard);
router.post('/jobs/apply', authMiddleware, upload.single('file'), jobController.applyJob);
router.get('/applications/:id/file', authMiddleware, jobController.downloadFile);

// Admin-specific job endpoints
router.get('/admin/jobs', authMiddleware, jobController.getAllJobs);
router.post('/admin/jobs', authMiddleware, jobController.createAdminJob);
router.put('/admin/jobs/:id', authMiddleware, jobController.updateAdminJob);
router.delete('/admin/jobs/:id', authMiddleware, jobController.deleteAdminJob);

module.exports = router;