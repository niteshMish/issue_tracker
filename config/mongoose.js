const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/issue_tracker_db');


const db = mongoose.connection;

db.on('error', console.error.bind(console,'Error in creating data base'));


db.once('open', function(){
   console.log('yeap !!! connected to data base');
});

module.exports = db;