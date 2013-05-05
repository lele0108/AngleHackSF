$(document).ready(function() {
	yam.connect.loginButton("#yammer-login", function (resp) {
		if (resp.authResponse) {
			$('#yammer-login').hide();
			$('#after-login').show();
		} 
	});
	
	$('.bio').toggle();
    $('.describe').toggle();
    $('.prize').toggle();
    $('.finish').toggle();
    
    $(".input-huge").keypress(function(event) {
        if (event.which == 13) {
          event.preventDefault();
          $('.search').toggle();
          $('.bio').toggle();
          $('.describe').toggle();
          $('.prize').toggle();
          $('.finish').toggle();
        }
      });
	
	$('.logout').click(function() {
		yam.getLoginStatus(function(response) {
			if(response.authResponse) {
				yam.logout(function (response) {
					$('#after-login').html();
					$('#yammer-login').show();
				});
			}
		})
	});
	
	$(".input-huge").bind("change paste keyup", function() {
		yam.getLoginStatus(
		  function(response) {
		    if (response.authResponse) {
		      yam.request({
			        url: "https://www.yammer.com/api/v1/autocomplete/ranked",     //this is one of many REST endpoints that are available
			        method: "GET",
			        data: {
			        	prefix: $("#userSearch").val(),
			            models: 'user:' + '20'
				    },
			        success: function (user) {
			          	arr = JSON.parse(JSON.stringify(user)).user;
					  	$("#searchUsersList").empty();
						if($("#userSearch").val() != "") {
							$.each(arr, function(i, v){
				        	  $("#searchUsersList").append('<span class="sUser" data-uid="'+(v.id)+'">'+(v.full_name)+'</span>');
						    });
						}
			        }
			      });
		    }
		    else {
		      alert("not logged in")
		    }
		  }
		);
	});
	
	$('.go').click(function() {
		yam.getLoginStatus(function(response) {
			if (response.authResponse) {
				var user_email = '';
				var user_name = '';
				var message = $('#user-message').val();
				yam.request({
					url : "https://www.yammer.com/api/v1/users/current.json",
					method : "GET",
					success : function(user) { //print message response information to the console
						user_email = user.web_preferences.home_tabs.length;
						user_name = user.name;
						console.log(JSON.stringify(user));
						var groups = [];
						for (var i=0; i<user.web_preferences.home_tabs.length; i++) {
							var tab = user.web_preferences.home_tabs[i];
							if (tab.type === 'group') {
								groups.push(tab.group_id);
							}
						}
						
						yam.request({
							url : "https://www.yammer.com/api/v1/messages.json",
							method : "POST",
							data : {
								body : message,
								og_url : window.location.href,
								og_title : user_name + ' was rewarded!',
								og_image : 'http://localhost/YammerApp/img/starbucks.png',
								og_description : message,
								og_object_type : 'employee',
								og_site_name : 'Yammbo'
								// group_id : groups[0]
							},
							success : function(user) { //print message response information to the console
								console.log(JSON.stringify(user));
							},
							error : function(error) {
								console.log(JSON.stringify(error));
							}
						});
					},
					error : function(error) {
						console.log(error);
					}
				});
			} else {
				alert("not logged in")
			}
		});
	});
});