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
module.exports.addProject = function(req , res){
    return res.render('add_project');
}


// module.exports.createProject = async function(req, res){
//     console.log(req.body);
//     console.log(req.body.label.length);
//     let projects = await Project.find({name:req.body.name});
//     if(projects.length == 0){
//         let project = await Project.create(req.body);
       
//         let label = await Label.create({
//             labelsList:{
//                  labelStatus:true,
//                  labelName:'NotDone'
//             },
//              project_id:project._id
//          });
        
//          project.labelId = await label._id; 
//          await project.save();
//     }
//      Project.find({}).populate({
//          path:'labelId'
//      })
//        .exec(function(err ,project){
       
//         return res.render('home',{
//             title:'home | issue_tracker',
//             Projects:project,
           
//         })
//     })
     
// }
// module.exports.createProject = async function(req, res){
//     console.log(req.body);
//     console.log(req.body.label.length);
//     let projects = await Project.find({name:req.body.name});
//     if(projects.length == 0){
//         let project = await Project.create(req.body);
//         for( let i = 0 ; i < req.body.label.length ; i ++){
//             if(i == 0){
//                 let label = await Label.create({
//                     labelsList:[{
//                          labelStatus:true,
//                          labelName:req.body.label[i]
//                     }],
//                      project_id:project._id
//                  });
                
//                  project.labelId = await label._id; 
//                  await project.save();
//             }else{
//                 Label.find({project_id:project._id}).exec(function(err , label){
//                     console.log("label---" , label[0].labelsList);
//                     console.log("label" , label);

//                     label[0].labelsList.push({
//                         labelName:req.body.label[i],
//                         labelStatus:false
//                      });
//                     label[0].save();
//                 })
//             }

//         }
        
//     }
//      Project.find({}).populate({
//          path:'labelId'
//      })
//        .exec(function(err ,project){
       
//         return res.render('home',{
//             title:'home | issue_tracker',
//             Projects:project,
           
//         })
//     })
     
// }


// action to create a project and its label

// module.exports.create = async function( req , res){
//     console.log(req.body);
//      return res.redirect('/');
// }

 
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
        return res.render('home' , {
           Projects:projects 
        })
    })
}




// module.exports.create = async function(req, res){
//         console.log(req.body);
//         Project.find({name:req.body.name}).exec(function(err , project){
//             if(project.length == 0 ){
//                  Project.create({
//                   description:req.body.description,
//                   name:req.body.name,
//                   author:req.body.author,
//                 }) 
//             //   },function(err , projectI){
//             //       if(err){
//             //           console.log("Error" , err);
//             //           return ;
//             //       }
//             //     console.log("newly created project" , projectI);
               
//                     // for(let  i = 0 ; i < label.length; i ++ ){
//                     //     Label.find({labelname:projectI.labelsList[i]} , function(err , labels){
//                     //         if(err){console.log("Error in finding label" , err);return ;}
//                     //         console.log(labels);
//                     //          if(labels.length != 0){
//                     //              labels[0].labeledAt.push(projectI._id);
//                     //              labels[0].save();
//                     //         }else{
//                     //              Label.create({
//                     //                     labelname:projectI.labelsList[i],
//                     //                     labeledAt:projectI._id
//                     //                    } ,function(err , lab){
//                     //                       if(err){
//                     //                          console.log("Error in creating label" , err);
//                     //                           return ;
//                     //                       }
//                     //                       console.log("lab" , lab);
//                     //             })
//                     //         }  
                            
//                     //     });
                       
//                     // }
//               });
             
//             }
//         })
        
//          Project.find({}).populate('issueList')
//            .exec(function(err ,project){
           
//             return res.render('home',{
//                 title:'home | issue_tracker',
//                 Projects:project,
               
//             })
//         })
         
//     }
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

/// Action to search according to fields as author, name ane description

module.exports.SearchByFields = function(req ,res){
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
