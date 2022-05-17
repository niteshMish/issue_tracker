const Project = require('../models/project');
const Issue = require('../models/issue');
const mongoose =require('mongoose');
module.exports.projectDetail = function(req , res){
    
   // console.log(mongoose.Types.ObjectId.isValid(req.params.id));
   console.log("params",req.params);
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
    console.log( "iiiidddddd",req.body.project_id)
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
                console.log(issues);
                return res.render('project_detail',{
                    Project:project,
                    Issues:issues
                })
            })
        })
    
    })
}
module.exports.searchAuthor = function(req, res){
    return res.render('project_detail');
  }
  module.exports.searchTitle = function(req, res){
      return res.render('project_detail');
  }
