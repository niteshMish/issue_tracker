const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true,
    },
   description:{
        type:String,
        required:true,
    },
    author:{
        type:String , 
        required:true
    },
    labelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Label'
    }
    ,
    issueList:[{
         type:mongoose.Schema.Types.ObjectId,
         ref:'Issue'
    }]
})
const Project = mongoose.model('Project',projectSchema);
module.exports = Project;