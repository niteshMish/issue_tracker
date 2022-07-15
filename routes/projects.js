const express = require('express');
const router = express.Router();

const projectController = require('../controller/project_controller');
router.post('/detail',projectController.projectDetail);
router.post('/add-issue' , projectController.addIssue);
router.post('/create-issue' , projectController.createIssue);
router.post('/issue-search-by-labels' , projectController.SearchByFields);
router.post('/update-issue-label',projectController.updateStatus);
router.post('/filter',projectController.filter )


module.exports = router;