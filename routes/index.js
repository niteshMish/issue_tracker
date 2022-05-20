const express = require('express');
const router = express.Router();

const homeController = require('../controller/home_controller');

router.get('/',homeController.home);
router.get('/add-project',homeController.addProject);
router.use('/project',require('./projects'));
router.post('/project-search-by-lables',homeController.SearchByLables)
router.post('/create-project' , homeController.createProject)
router.get('/update-project-label',homeController.updateLabel)


module.exports = router;