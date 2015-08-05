$(document).ready(function(){

var Home = {

	getUserInfo: function (){

		$.ajax({
			type: "GET",
			url: '/api/sessions',
			success: function(response){
				if (response.authenticated === false) {
					window.location.replace('/');
				} else {
					$('.top_right_name').html(response.session.username + '<span class="caret" style="margin-left: 10px"></span>');
				}
			}
		})
	},

	signOut: function (){

		$.ajax({
			type: "DELETE",
			url: '/api/sessions',
			success: function(response){
				if (response.logout === true) {
					window.location.replace('/');
				}
			}
		})
	},

	addSubscribe: function (code){

		$.ajax({
			type: "PUT",
			url: "/api/users/club",
			data: {
				clubcode: code
			},
			success: function(response) {
				console.log(response);
			},
			error: function (err) {
				console.log('stupid!');
			}
		})
	}

}

Home.getUserInfo();

$(document).on('click', '.sign_out', function(){
	event.preventDefault();
	Home.signOut();
})

$(document).on('click', '.goAddClub', function(){
	event.preventDefault();
	var code = $('input[placeholder="club code"]').val();
	Home.addSubscribe(code);
})





})