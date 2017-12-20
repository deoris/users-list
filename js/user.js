/*global $ */
var ManageUsers = function() {
   return {
       editMode: false, 
       messageError: {
               "text": "Mandatory field. Must contain only letters.",
               "email": "Mandatory field. Must contain a valid email.",
               "password": "Password doesn't match.",
               "userexist": "User already exsists."
           },
       messageTitle: {
			"editMode": "Edit User",
			"createMode": "New User"
		},
       currentuser: new UserEntity(),      
	   init: function() {
		   $("#addUser").click(function() {
               var isUserValid = true;
               for (prop in ManageUsers.currentuser){
                  if (ManageUsers.currentuser[prop] == "" || 
                      ManageUsers.currentuser[prop] == null || 
                      ManageUsers.currentuser[prop] == undefined) {
                      isUserValid = false;
                  }
                }

               if (isUserValid) {                       
                   if (ManageUsers.editMode) {                       
                        var userToUpdate = $.map(Index.usersList, function(el, ind) {
                           return el.ID == ManageUsers.currentuser.ID ? ind : null
                       })[0];                       
                       Index.usersList.splice(userToUpdate, 1, ManageUsers.currentuser)
                       Index.updateList();
                       ManageUsers.currentuser = new UserEntity();
                       ManageUsers.editMode = false;
                   } else {
                       var alreadyExsist = $.grep(Index.usersList, function(el, ind) {
                           return el.email == ManageUsers.currentuser.email
                       })
                       if (alreadyExsist.length > 0) {
                           $("#errorMessage").text("User already exsists.");
                           $("#errorMessage").removeClass("hidden");
                       } else {
                           ManageUsers.currentuser.ID = ManageUsers.createGUID();
                           Index.usersList.push($.extend({}, ManageUsers.currentuser));
                           Index.updateList();
                           ManageUsers.currentuser = new UserEntity();
                       }
                   }
               }
           });
		   
		   $("#modalUser").on("hidden.bs.modal", function() {
				$("#modalUser input").val("");	   
                $.each($("#modalUser input"), function(index, element) {
                    element.setCustomValidity("");
                })
				ManageUsers.currentuser = new UserEntity(); 
				ManageUsers.editMode = false;
		   })
		},
       createInit: function (id) {
           if (id) {
               ManageUsers.editMode = true;
               ManageUsers.getUser(id);    
				$("#modalUser .modal-title").text(ManageUsers.messageTitle.editMode)			   
           } else {
			   $("#modalUser .modal-title").text(ManageUsers.messageTitle.createMode)
		   }
            
           ManageUsers.inlineValidation();    
       },
       inlineValidation: function() {
           
           $("#name, #lastname").bind("keyup blur", function(e) {
                var str = this.value;
                var keycode = e.keyCode || e.which;
                if (keycode != '9') {
                   if (!ManageUsers.validateText(str) || str == "") {                       
                       this.setCustomValidity(" ");
                       if (e.type == "blur")
                           ManageUsers.handleError(this, ManageUsers.messageError.text)
                   } else {
                       this.setCustomValidity("");
                       ManageUsers.handleError(this)
                   }
                    
                   ManageUsers.updateUser(this);
                } 
           }) 
           
           $("#email").bind("keyup blur", function (e) {               
               var str = this.value;
               var keycode = e.keyCode || e.which;
               if (keycode != '9') {
                   if (!ManageUsers.validateEmail(str)) {
                       this.setCustomValidity(" ");
                       if (e.type == "blur")
                           ManageUsers.handleError(this, ManageUsers.messageError.email)
                   } else {
                        this.setCustomValidity("");
                        ManageUsers.handleError(this);
                   }
                   ManageUsers.updateUser(this);
                }
           })         
           
           $("#email").bind("blur", function(){
               
               if (ManageUsers.editMode) {
                   var alreadyExsist = $.grep(Index.usersList, function(el, ind) {
                       return el.email == ManageUsers.currentuser.email && el.ID != ManageUsers.currentuser.ID
                   })    
               } else {
                    var alreadyExsist = $.grep(Index.usersList, function(el, ind) {
                       return el.email == ManageUsers.currentuser.email 
                   })    
               }                          
               
               if (alreadyExsist.length > 0) {
                   this.setCustomValidity(" ");                       
                   ManageUsers.handleError(this, ManageUsers.messageError.userexist);
                   $("#addUser").attr("disabled", "disabled")
               }
               
           })
          
           $("#password, #passwordconfirm").bind("keyup", function (e) {
                ManageUsers.validatePassword(this, e);
           });
           $("#password, #passwordconfirm").bind("blur", function (e) {
                ManageUsers.validatePassword(this, e);
           })
       },
       getUser: function(id){
           ManageUsers.currentuser = $.extend({}, $.grep(Index.usersList, function(el, ind) {
               return el.ID == id
           })[0]);
           
           for(prop in ManageUsers.currentuser) {
               $("#" + prop).val(ManageUsers.currentuser[prop])       
           }
           $("#passwordconfirm").val(ManageUsers.currentuser.password)
       },
       updateUser: function(element) {           
            var field = element.getAttribute("id");
            ManageUsers.currentuser[field] = element.value;
           
            if ($("input:invalid").length == 0) {  
               
                var isUserValid = true;
                for (prop in ManageUsers.currentuser){
                    if (ManageUsers.currentuser[prop] == "" || 
                      ManageUsers.currentuser[prop] == null || 
                      ManageUsers.currentuser[prop] == undefined) {
                      isUserValid = false;
                    }
                }
              
               if (isUserValid) {
                    $("#addUser").removeAttr("disabled")   
                    if(ManageUsers.editMode) {
                       //TO DO chiedi conferma di uscire
                    }
                } else {
                    $("#addUser").attr("disabled", "disabled")
                }
            } else {
                $("#addUser").attr("disabled", "disabled")
            }                  
       },     
       validateEmail: function (val) {
            var regemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regemail.test(val);
       },
       validateText: function (val) {
           var regtext = /^[a-zA-Z ]*$/;
           return regtext.test(val);
       },
       validatePassword: function (element, ev) {
                    
           var confirm = document.getElementById("passwordconfirm");           
           var password = document.getElementById("password");

           if (password.value != confirm.value) {
               if ($('#passwordconfirm').val() != "" || ev.type == "blur" ) {
                   //password.setCustomValidity("Password doesn't match.");
                   confirm.setCustomValidity(" ");   
                   if (ev.type == "blur")
                       ManageUsers.handleError(confirm, ManageUsers.messageError.password);
               }
           } else {
               //password.setCustomValidity("");
               confirm.setCustomValidity("");     
               //if (ev.type == "blur")
               ManageUsers.handleError(confirm);
           }
           ManageUsers.updateUser(password);
       },
       createGUID: function() {                       
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });                    
       },
       handleError: function(element, message) {
           if(message != null) {               
               if($(element).next(".tooltip.in").length == 0) {
                   $(element).tooltip({
                       title: message,
                       trigger: "manual",
                       placement: "bottom"
                   }).tooltip('show');
                   
                   window.setTimeout(function() {
                       $(element).tooltip("hide");
                   },3000)
               } 
           } else {
               $(element).tooltip("hide");
           }
           
       }
   }    
}();