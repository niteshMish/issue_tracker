const Project = require('../models/project');
const Issue = require('../models/issue');
const Label = require('../models/labels');

/// action to show a particuler project deatils

module.exports.projectDetail = function(req , res){
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

// action to add issue to form the the issue list for a project
module.exports.addIssue = function(req, res){
   
    return res.render('add_issue',{
     project_id : req.body.project_id}
    );
}
/// action to add issue to the data base 
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

//// action to search issue according to the fields 1 - author , 2 - title
 module.exports.SearchByFields = async function(req ,res){
        console.log(req.body);
        let issueList = [];
        if(req.body && req.body.author && req.body.title){
           let issue = await Issue.find({
                author:req.body.author,
                title:req.body.title
             }).populate('labelsList');
            
                console.log(" line no 91 issue" , issue);
                if( issue && issue.length > 0){
                    for(let i of issue){
                        if(i.project_id == req.body.project_id){
                            issueList.push(i);
                        }
                    }
                }
                 Project.findById(req.body.project_id).exec(function(err , project){
                    console.log(issue);
                    return res.render('project_detail',{
                    Issues:issueList,
                    Project:project
                    });
                });
        }else{
          if( req.body && req.body.author){
            console.log("author line no 107" ,typeof(req.body.author) , req.body.author.length );
           let issue = await Issue.find({author:req.body.author }).populate('labelsList');
            
                console.log(" line no 109 issue" , issue);
                if( issue && issue.length> 0 ){
                    for(let i of issue){
                        if(i.project_id == req.body.project_id){
                            issueList.push(i);
                        }
                    }
                }
                 Project.findById(req.body.project_id).exec(function(err , project){
                    console.log(issue);
                    return res.render('project_detail',{
                    Issues:issueList,
                    Project:project
                    });
                });
            
        }else if(req.body && req.body.title){
            
            console.log("title line no 125" ,typeof(req.body.title) , req.body.title.length );
            let issue =  await Issue.find({ 
                title:req.body.title})
                .populate('labelsList');
           
                console.log(" line no 125 issue" , issue);
                if( issue && issue.length > 0){
                    for(let i of issue){
                        if(i.project_id == req.body.project_id){
                            issueList.push(i);
                        }
                    }
                }
                 Project.findById(req.body.project_id).exec(function(err , project){
                    console.log(issue);
                    return res.render('project_detail',{
                    Issues:issueList,
                    Project:project
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

 // action use to filter  ,   according to the labels ,and author
 module.exports.filter = async function(req,res){

    
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
        let currLabel = labelList[i];
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

    let project1 =  await Project.findById(project_id).populate('issueList');
    console.log("first" , list);
      return res.render('project_detail',{
        
            Project:project1,
            Issues:list
        })

}  

 

 