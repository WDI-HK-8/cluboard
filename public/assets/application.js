$(document).ready(function(){

	var Cluboard = function (){

	}

	Cluboard.prototype.getSignUpValue = function (){
		var answerHash = {
			user: {
				username: $('.sign_up input#sign_up_username').val(),
				password: $('.sign_up input#sign_up_password').val()
			}
		}
		return answerHash;
	}

	Cluboard.prototype.getLogInValue = function (){
		var answerHash = {
			user: {
				username: $('.log_in input#log_in_username').val(),
				password: $('.log_in input#log_in_password').val()
			}
		}
		return answerHash;
	}

	Cluboard.prototype.submitSignUp = function (){
		var answerHash = this.getSignUpValue();
		
		$.ajax({
			type: "POST",
			url: "/api/users",
			data: answerHash,
			dataType: 'JSON',
			success: function (response) {
				$('.sign_up input#sign_up_username').val("");
				$('.sign_up input#sign_up_password').val("");
				if (response.create === true) {
					$('div.alert-success').show();
					setTimeout(function(){
						$('div.alert-success').hide();
					},1200)
				} else if (response.create === false) {
					$('div.notSignUp').show();
					setTimeout(function(){
						$('div.notSignUp').hide();
					},1200)
				}
			},
			error: function (err) {
				console.log(err);
			}
		})
	}

	Cluboard.prototype.submitLogIn = function (){
		var answerHash = this.getLogInValue();
		
		$.ajax({
			type: "POST",
			url: "/api/sessions",
			data: answerHash,
			dataType: 'JSON',
			success: function (response) {
				$('.log_in input#log_in_username').val("");
				$('.log_in input#log_in_password').val("");
				if (response.insertCookie === "success") {
					window.location.replace('home')
				} else if (response.insertCookie === "fail") {
					$('div.alert-danger:not(div.notSignUp)').show();
				} else if (response.admin === true) {
					window.location.replace('admin');
				}
			},
			error: function (err) {
				console.log(err);
			}
		})
	}


	var cluboard = new Cluboard();

	$(document).on('click','.sign_up button', function(){
		event.preventDefault();
		cluboard.submitSignUp();
	})

	$(document).on('click', '.log_in button', function(){
		event.preventDefault();
		cluboard.submitLogIn();
	})

})