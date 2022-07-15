const Project = require('../models/project');
const Issue = require('../models/issue');
const Label = require('../models/labels');

/// action to show a particuler project deatils

module.exports.projectDetail = function(req , res){
    
   // console.log(mongoose.Types.ObjectId.isValid(req.params.id));
  
   let id = req.body.project_id;
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

// action to add issue to the the issue list for a project
module.exports.addIssue = function(req, res){
   
    return res.render('add_issue',{
     project_id : req.body.project_id}
    );
}
 module.exports.createIssue = async function(req , res){
     let issue = await Issue.create({
        title:req.body.title, 
        description:req.body.description,
        author:req.body.author,
        labelsList:req.body.labels,
        project_id:req.body.project_id
      });
       if(issue){
        for(lab of issue.labelsList){
            console.log("lab",lab);
            console.log("labelList",issue.labelsList);

            let label =  await Label.find({labelname:lab});
            
            if(label.length == 0){
                
                let l = await Label.create({labelname:lab});
                console.log("--------->>>> l",l);
                if(l){
                    l.issueList.push(issue._id);
                    await l.save();
                }
            }else{
                label[0].issueList.push(issue._id);
                label[0].save();
            }
        }
        let id = req.body.project_id;
        Project.findById(id).exec(function(err , project){
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

}

 }
// module.exports.createIssue =  async function(req , res){
//     console.log(req.body)
//     let labels = req.body.labels;
//     console.log("labels",labels,labels.length);
//     Issue.create({
//           title:req.body.title, 
//           description:req.body.description,
//           author:req.body.author,
//           labelsList:req.body.labels,
//           project_id:req.body.project_id
//     },function(err , issue){
//            if(err){
//                console.log("Error in creating issue  " , err);
//                return ;
//            }

//         //    issue.labelsList = labels;
//         //    issue.save();
//            //// iterate over the label  and create  label 
//            for(li of labels){
//             console.log( li);
//            }
//              for( l of labels){
//                  Label.find({labelname:l},function(err , label){
//                     console.log("innnnnnnre label" ,label);
//                     if(label.length == 0){
//                         Label.create({labelname:l},function(err , lab){
//                             if(err){console.log("Error in creating label of issue" , err) ;
//                             return ;}
//                             console.log("l------->>>>>>" ,lab);
//                             lab.issueList.push( issue._id);
//                             lab.save();
//                         })
//                      }else{
//                         console.log("hiiiiiiiiiiiiiiiiiiiiiiiiii");
//                         label[0].issueList.push(issue._id);
//                         label[0].save();
//                      }
//                  })
//              }

//            let id = req.body.project_id;
//             Project.findById(id).exec(function(err , project){
//             project.issueList.push(issue);
//             project.save();
//             Issue.find({project_id:id} , function(err , issues){
//                 if(err){
//                     console.log('ERR in finding issues',err);
//                     return;
//                 }
                
//                 return res.render('project_detail',{
//                     Project:project,
//                     Issues:issues
//                 })
//             })
//         })
    
//     })
// }
////////

// module.exports.addIssue = function(req , res){
//     let labels = req.body.labels.split(',');
//     Issue.create({
//         title:req.body.title, 
//         description:req.body.description,
//         author:req.body.author,
//         labelsList:labels
//   } ,function(err , issue ){
//     for( l of issue.labelsList){
//         IssueLabel.find({labelname:i})
//     }
//   })

// }


////////


//// action to search issue according to the fields 1 - author , 2 - title,description
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
    /// action to update the status of issue of any project
 module.exports.updateStatus = async function(req , res) {
     if(req.query.label === 'resolved'){
         
         Issue.findById({_id:req.query.issue_id}).exec(function(err , issue){
             console.log(issue);
             issue.labels.resolved = true;
             issue.labels.unResolved = false;
             issue.save();
             console.log(issue);
         });
    }else{
       Issue.findById({_id:req.query.issue_id}).exec(function(err , issue){
            console.log("first",issue);
            issue.labels.resolved = false;
            issue.labels.unResolved = true;
            issue.save();
            console.log("second",issue);
        });
   }
    
     let id = req.query.project_id;
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

 // action use to filter the issue according to the labels on it
 module.exports.filter = async function(req,res){

    //////
     // map 
     /// if(label) -> call a method wait
     // if(author) -> call method wait



    ///////
    let project_id = req.body.project_id;
    console.log("pro" , project_id);
    let map1 = new Map();
    let list =[];
    let labelList = [];
    if( req.body.label ){
        let labelFilter = () =>{
             if(typeof(req.body.label) === 'string'){
                labelList[0] = req.body.label
            }else{
                labelList = req.body.label;
            }
         for( let i = 0 ; i < labelList.length ; i ++){
        console.log( "line no 243 labelList",labelList[i]);
        let currLabel = labelList[i].substring(1);
        console.log(currLabel.substring(1));
        console.log("curr" , currLabel , typeof(currLabel));
        Label.find({labelname:currLabel} ,function(err ,labelId){
            if(err){
                console.log("err in finding labelId" , err);
                return;
            }
            console.log("labelId" , labelId);
            if(labelId.length > 0){
                console.log("line no 245" ,labelId[0].issueList.length );
                for( let j = 0 ;  j < labelId[0].issueList.length ; j++){
                    if(map1.has(labelId[0].issueList[j]._id)){
                        continue;
                    }else{
                        let issue_id = labelId[0].issueList[j]._id;
                        Issue.findById(issue_id).exec(function(err , issue){
                             if(issue.project_id == project_id){
                                map1.set(labelId[0].issueList[j].id , true);
                                list.push(issue);
                             }
                        })
                       
                    }
                }
            }

        });
        
        
    }

    }
    labelFilter();
    }
    /// now filter by author 
    if(req.body.author){
        
        let x = () =>{
            let author = req.body.author;
        console.log(author);
         Issue.find({author:req.body.author}).exec(function(err , issue){
            if( err){console.log("error in finding issue and " , err); return ;}
            console.log("line no 271 issue " , issue );
            if(issue){
                for( let i = 0 ; i < issue.length ; i ++){
                    if(map1.has(issue[i]._id)){
                        continue;
                    }else{
                        let issue_id = issue[i]._id;
                        Issue.findById(issue_id).exec(function(err , issue){
                             if(issue.project_id == project_id){
                                map1.set(issue_id , true);
                                list.push(issue);
                                console.log(" i touched")
                                console.log("size of map", map1.size);
                             }
                        })
                    }
                }

            }
        }) ;

        }
     x();        
       console.log("line no 288  ,  map  size" , map1.size);
    }
//  

//     let k =0;

//     for( let key of map1.keys()){
//         list[k++] = key;
//     }
//     console.log("List length " , list.length, map1.size);
//     for(let i = 0 ; i < list.length;i++){
//         console.log(list[i]);
//     }
//     console.log("pro" , project_id);
//    let proj =  await Project.findById(project_id);
//    console.log("pro" , proj);
//    await Project.findById(project_id).populate('list')
//     .exec(function(err , project){
//         console.log("project------>", project)
//         return res.render('project_detail',{
//             Project:proj,
//             Issues:list
//         })
//     })
    let project1 =  await Project.findById(project_id).populate('issueList');
    console.log("first" , list);
      return res.render('project_detail',{
        
            Project:project1,
            Issues:list
        })

}  

 

 