const mongoose = require('mongoose');


const LabelSchema = new mongoose.Schema({
    labelname:{
        type:String,
    },
    issueList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Issue',
         
       }]   
   },{
    timestamps:true
} 
)

const Label = mongoose.model('Label',LabelSchema);
module.exports = Label; 