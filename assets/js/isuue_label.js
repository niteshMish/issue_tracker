let updateLabel = function(){
         let updateForm = $('.update-issue');
         
         
         updateForm.submit(function(e){
        //  e.preventDefault();
            $.ajax({
                type:'post',
                url:'/project/update-issue-label',
                data:updateForm.serialize(),
                success:function(data){
                   console.log(data);
                },
                error:function(error){
                    console.log(error.responseText);
                }

            })
        })
       
     }


     let updateFormDOM = function(){
         return ``
     }
updateLabel();
