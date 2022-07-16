const Label = require('../models/labels');
const { find } = require('../models/project');
const Project = require('../models/project');

/// action to show the home page or project deatil page 

module.exports.home = function(req, res){
     
    Project.find({})
    .exec(function(err ,project){
        return res.render('home',{
            title:'home | issue_tracker',
            Projects:project
        })
    })
}

/// action to show the form  page  

module.exports.addProject = function(req , res){
    return res.render('add_project');
}

// action to create project
module.exports.create =  function( req , res){
    Project.create({
        name:req.body.name,
        description:req.body.description,
        author:req.body.author
    },function(err , project){
        if(err){
            console.log("error in creating project " , err);
            return ;
        }
        console.log("project created successfully" ,project);
    })
    Project.find({}).exec(function(err ,projects){
        return res.redirect('/')
          
    })
}
/// Action to search according to fields as author, name  of project

module.exports.SearchByFields = function(req ,res){
    console.log( "req body",req.body);
    console.log(req.body.author, req.body.name);

    if(req.body && req.body.author && req.body.name){
        Project.find({
            author:req.body.author,
            name:req.body.name
         }).populate('issueList')
        .exec(function(err ,Projects){
           
            return res.render('home',{
                Projects:Projects
            });
        })
        
    }else{
      if( req.body && req.body.author){
        Project.find({author:req.body.author }).populate('issueList')
        .exec(function(err ,Projects){
            console.log(Projects);
            return res.render('home',{
            Projects:Projects
            });
        });
    }else if(req.body && req.body.name){
        Project.find({name:req.body.name }).populate('issueList')
        .exec(function(err ,Projects){
            console.log(Projects);
            return res.render('home',{
            Projects:Projects
            });
        });
    }
  } 
}

//// action to update the current status of the project ( Done , notDone);

module.exports.updateStatus =   async function(req ,res){
 Project.findById({_id:req.query.project_id}).exec(function(err , project){
    //    console.log(project);
          Label.findById({_id:project.labelId}).exec(function(err , label){
              for(let i =0 ; i <label.labelsList.length ;i ++){
                  if(label.labelsList[i].labelName == req.query.label){
                    label.labelsList[i].labelStatus =true;
                  }else{
                    label.labelsList[i].labelStatus =false; 
                  }
              }
              label.save();
          })
   })
     Project.find({}).populate({
        path:'labelId'
    })
      .exec(function(err ,project){
      
       return res.render('home',{
           title:'home | issue_tracker',
           Projects:project,
          
       })
   })
}
