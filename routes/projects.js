const express = require('express');
const router = express.Router();

const projectController = require('../controller/project_controller');
router.get('/project-detail/:id',projectController.projectDetail);
router.post('/add-issue' , projectController.addIssue);
router.post('/create-issue' , projectController.createIssue);
router.get('/search-by-author' , projectController.searchAuthor);
router.get('/search-by-title' ,projectController.searchTitle);

module.exports = router;