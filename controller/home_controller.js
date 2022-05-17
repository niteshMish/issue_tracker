const Label = require('../models/labels');
const Project = require('../models/project');
module.exports.home = function(req, res){
     
    Project.find({}).populate('labelId')
    .exec(function(err ,project){
        return res.render('home',{
            title:'home | issue_tracker',
            Projects:project
        })
    })
}
module.exports.addProject = function(req , res){
    return res.render('add_project');
}

module.exports.createProject = async function(req, res){
    let projects = await Project.find({name:req.body.name});
    if(projects.length == 0){
        let project = await Project.create(req.body);
        console.log("project 1",project);
        let label = await Label.create({
            labelsList:{
                 labelStatus:true,
                 labelName:'NotDone'
            },
             project_id:project._id
         });
         console.log("label 2",label);
         project.labelId = await label._id; 
         await project.save();
    }
     Project.find({}).populate({
         path:'labelId'
     })
       .exec(function(err ,project){
        console.log("fdmsgdfhgkdfhgkdhfkg",project);
        return res.render('home',{
            title:'home | issue_tracker',
            Projects:project,
           
        })
    })
     
}
// module.exports.addProject = async function(req , res){
//    console.log( "1 .body",req.body);
//    Project.find({ name :req.body.name}).exec(function(err ,project){
//         console.log(" 2.project",project);
//         if(project.length == 0){
//            await Project.create(req.body);
//             console.log("author" , req.body.author);
//             Project.find({name:req.body.name}).exec(function(err , project){
//                 console.log(" 3 .project----->",project)
//                await Label.create({
//                    labelsList:{
//                         labelStatus:true,
//                         labelName:'NotDone'
//                    },
//                     project_id:project._id
//                 });
//                 Label.find({project_id:project.id}).exec(function(err , label){
//                     project.label_id = label._id;
//                     console.log("4",label);
                   
//                 })
//             });
           
//         }
//     });
//     Project.find({}).populate('issueList')
//     .populate('label_id')
//     .exec(function(err ,project){
//         return res.render('home',{
//             title:'home | issue_tracker',
//             Projects:project
//         })
//     })

// }
module.exports.SearchByLables = function(req ,res){
    console.log(req.body);
    if(req.body && req.body.author && req.body.name){
        Project.find({
            author:req.body.author,
            name:req.body.name
         })
        .exec(function(err ,Projects){
            console.log(Projects);
            return res.render('home',{
                Projects:Projects
            });
        })
        
    }else{
      if( req.body && req.body.author){
        Project.find({author:req.body.author })
        .exec(function(err ,Projects){
            console.log(Projects);
            return res.render('home',{
            projects:Projects
            });
        });
    }
  } 
}
