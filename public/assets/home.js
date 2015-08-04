$(document).ready(function(){

var home = function (){

}

home.prototype.getUserInfo = function (){



	$.ajax({
		type: "GET",
		url: '/api/sessions',
		success: function(response){
			if (response.authenticated === false) {
				window.location.replace('/');
			} else {
				var userID = response.session.user_id;
				$.ajax({
					type: 'GET',
					url: '/api/users/' + userID,
					success: function (response){
						
					}
				})
			}
		}
	})
}








})