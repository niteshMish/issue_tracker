const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
   title :{
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
    
    project_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project'
    }
})
const Issue = mongoose.model('Issue',issueSchema);
module.exports =Issue ;