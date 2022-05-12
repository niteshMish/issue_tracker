const Project = require('../models/project');
module.exports.home = function(req, res){
     
    Project.find({}).exec(function(err ,project){
        return res.render('home',{
            title:'home | issue_tracker',
            Projects:project
        })
    })
}
module.exports.addProject =   function(req , res){
    
    let project = Project.findOne(req.body);
    if(project){
            if(project.name != req.body.name){
                 Project.create(req.body);
            }
    }else{
         Project.create(req.body); 
    }
    Project.find({}).populate('issueList')
    .exec(function(err ,project){
        return res.render('home',{
            title:'home | issue_tracker',
            Projects:project
        })
    })

}
