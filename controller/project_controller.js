const Project = require('../models/project');
const Issue = require('../models/issue');
const mongoose =require('mongoose');
module.exports.projectDetail = function(req , res){
    
   // console.log(mongoose.Types.ObjectId.isValid(req.params.id));
  
   let id = req.params.id;
    Project.findById(id)
    .populate('issueList')
    .exec(function(err , project){
        if(err){
            console.log("Error in finding the Project " ,err)
            return ;
        }
        let isuues = project.issueList;
        return res.render('project_detail',{
            Project:project,
            Issues:isuues
        });
    })
}
module.exports.addIssue = function(req, res){
   
    return res.render('add_issue',{
     project_id : req.body.project_id}
    );
}
module.exports.createIssue = function(req , res){
    console.log(req.body);
    Issue.create(req.body ,function(err , issue){
           if(err){
               console.log("Error " , err);
               return ;
           }
           let id = req.body.project_id;
        Project.findById(id).populate('issueList').exec(function(err , project){
            project.issueList.push(issue);
            project.save();
            Issue.find({project_id:id} , function(err , issues){
                if(err){
                    console.log('ERR in finding issues',err);
                    return;
                }
                
                return res.render('project_detail',{
                    Project:project,
                    Issues:issues
                })
            })
        })
    
    })
}

    module.exports.SearchByLables = function(req ,res){
        console.log(req.body);
        if(req.body && req.body.author && req.body.name){
            Project.find({
                author:req.body.author,
                name:req.body.name
             }).populate('labelId')
            .exec(function(err ,Projects){
               
                return res.render('home',{
                    Projects:Projects
                });
            })
            
        }else{
          if( req.body && req.body.author){
            Project.find({author:req.body.author }).populate('labelId')
            .exec(function(err ,Projects){
                console.log(Projects);
                return res.render('home',{
                Projects:Projects
                });
            });
        }else if(req.body && req.body.name){
            Project.find({name:req.body.name }).populate('labelId')
            .exec(function(err ,Projects){
                console.log(Projects);
                return res.render('home',{
                Projects:Projects
                });
            });
        }
      } 
    }
   
  
 