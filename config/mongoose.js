const mongoose = require('mongoose');

require('dotenv');
mongoose.connect(process.env.CONNECT);


const db = mongoose.connection;

db.on('error', console.error.bind(console,'Error in creating data base'));


db.once('open', function(){
   console.log('yeap !!! connected to data base');
});

module.exports = db;