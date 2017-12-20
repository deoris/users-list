/*global $ */
var Index = function () {
    return {
        usersList: new Array(),
		userToRemove: null,
		usersToRemove: new Array(),
        init: function () {
            $('[data-toggle="tooltip"]').tooltip();
            
			//add button
			Index.addInit()            
			
			//delete button
			Index.deleteInit();
			
			//Users Init
			ManageUsers.init()
			
            if (Index.usersList.length != 0) {
                $("#nouser").addClass("hidden");
                Index.updateList();
            }            
			
        },
		addInit: function() {
			$('#addButton, #addFirstUser').click(function(){               
				$('#modalUser').modal('show');       
				ManageUsers.createInit();                     
            });      
		},
		deleteInit: function() {		   
		   $("#dltUser").click(function() {   
               if (Index.usersToRemove.length > 0) {
                   $.each(Index.usersToRemove, function(index, ID){
                        var indUsr = $.map(Index.usersList, function(el, ind) {
                            return el.ID == ID ? ind : null
                        })[0];
                        Index.usersList.splice(indUsr, 1);
                   });
                   Index.usersToRemove = new Array();
                } else {               
                   Index.usersList.splice(Index.userToRemove, 1);
                }
               
               Index.updateList();
               $('#modalDelete').modal('hide'); 
		   });
            
            $("#selectAll").change(function() {                  
                if($("#selectAll").is(":checked")) {
                    $("[id*='ckb_']:not(:checked)").closest(".multiselect").addClass("stay");
                    $("[id*='ckb_']:not(:checked)").closest("tr").addClass("highlight");
                    $("[id*='ckb_']:not(:checked)").prop("checked", true).change();                    
                } else {
                    $("[id*='ckb_']").prop("checked", false).change();
                    $("[id*='ckb_']").closest(".multiselect").removeClass("stay");
                    $("[id*='ckb_']").closest("tr").removeClass("highlight");
                }
            });
            
            $("#deleteMoreButton").click(function() {                    
                $("#emailsToDel").removeClass("hidden");
                $('#modalDelete').modal('show'); 
                
            });
            
            $('#modalDelete').on("hidden.bs.modal", function(){
                $("p").addClass("hidden");                
                Index.userToRemove = null;
            })
		},        
        updateList: function(){
            var list = null;
			if (Index.usersList.length == 0) {
				$("#nouser").removeClass("hidden");				
				$("#userTable").addClass("hidden")
			} else {
				$.each(Index.usersList, function(index, element){
					var template = document.getElementById("tmpUser").innerHTML;
					for (prop in element) {
						template = template.replace( new RegExp("{" + prop + "}", "g"), element[prop])
					}
					list += template;
				})
							
				if ($("#userTable").hasClass("hidden"))
					$("#userTable").removeClass("hidden")
				
				$("#userList").empty();
				$("#userList").append($.parseHTML(list));
				
				if (!$("#nouser").hasClass("hidden"))
					$("#nouser").addClass("hidden");
				
				$('#modalUser').modal('hide');  
                
				Index.dragRow();
			}
            
            $(".highSelection").removeClass("active");
            Index.usersToRemove = new Array();
            
            if($("#selectAll").is(":checked"))                 
                $("#selectAll").prop("checked", false);
                

        },
        editUser: function(id) { 
			$('#modalUser').modal('show');       
			ManageUsers.createInit(id);     
        },
        deleteUser: function(id) {  
			Index.userToRemove = $.map(Index.usersList, function(el, ind) {
				return el.ID == id ? ind : null
			})[0];
		    $("#emailToDel").text(Index.usersList[Index.userToRemove].email);
            $("#emailToDel").closest("p").removeClass("hidden")
				 		
			$('#modalDelete').modal('show');      
            
        },
		selectUser: function(id) {
			if ($("#ckb_"+ id).is(":checked")) {
				$("#ckb_"+ id).closest(".multiselect").addClass("stay");
				$("#ckb_"+ id).closest("tr").addClass("highlight");
                $(".highSelection").addClass("active");
				Index.usersToRemove.push(id);
			} else {                
				$("#ckb_"+ id).closest(".multiselect").removeClass("stay");
				$("#ckb_"+ id).closest("tr").removeClass("highlight");		
				var indUsr = $.map(Index.usersToRemove, function(el, ind) {
					return el == id ? ind : null
				})[0];
				Index.usersToRemove.splice(indUsr, 1);
                if ($("#selectAll").is(":checked")) {
                    $("#selectAll").prop("checked", false);
                }
                if (Index.usersToRemove.length == 0) {                    
                    $(".highSelection").removeClass("active");
                }
                
			}
		},
        dragRow: function() {
           $(".dragme").mousedown(function (e) {                
                var tr = $(e.target).closest("TR");
                var si = tr.index();
                var sy = e.pageY;
                var b = $("body");
                var drag;
                b.addClass("dragme").css("userSelect", "none");                
                tr.addClass("dragging");
                
                function move (e) {                    
                    if (!drag && Math.abs(e.pageY - sy) < 10) return;
                    drag = true;
                    tr.siblings().each(function() {
                        var s = $(this), i = s.index(), y = s.offset().top;
                        if (e.pageY >= y && e.pageY < y + s.outerHeight()) {
                            if (i < tr.index()) {                                
                                s.insertAfter(tr);  
                                Index.moveList(s.index(), tr.index());                                
                            } else {
                                s.insertBefore(tr);
                                Index.moveList(s.index(), tr.index());                                
                            }
                            return false;
                        }
                    });
                }
                function up (e) {                    
                    if (drag && si != tr.index()) {
                        drag = false;
                    }
                    $(document).unbind("mousemove", move).unbind("mouseup", up);
                    b.removeClass("dragme").css("userSelect", "auto");
                    tr.addClass("dragged").removeClass("dragging");
                    window.setTimeout(function(){
                        tr.removeClass("dragged");
                    },500)
                }
                $(document).mousemove(move).mouseup(up);
            });
        },
        moveList: function(from, to) {
            Index.usersList.splice(to, 0, Index.usersList.splice(from, 1)[0])
        }
    }
}();