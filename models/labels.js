const mongoose = require('mongoose');

const LabelSchema = new mongoose.Schema({
   labelsList:[{
         labelName:{
             type:String
         },
         labelStatus:{
            type:Boolean,
            default:false
         }
    }],
    project_id:{
           type:mongoose.Schema.Types.ObjectId,
           ref:'Project'
    }
})
const Label = mongoose.model('Label',LabelSchema);
module.exports = Label;