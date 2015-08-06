$(document).ready(function(){

	var Home = {

		getUserInfo: function (){

			$.ajax({
				type: "GET",
				url: '/api/sessions',
				success: function(response){
					if (!response.authenticated) {
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
					Home.getSubscribe();
					Home.getNewsList();
				}
			})
		},

		getSubscribe: function (){

			$.ajax({
				type: "GET",
				url: "/api/users/club",
				success: function (response) {
					if (response.length === 0) {
						$('span.subscribedClub').html('<p class="noBelong">You belong to nowhere :(</p>');
						return;
					}
					var html = "";
					for (var i = 0; i < response.length; i++){
								html += "<a name=\"";
								html += response[i];
								html += "\">";
								html += response[i];
								html += "<span class=\"glyphicon glyphicon-remove\"></span></a>";
					}
					$('span.subscribedClub').html(html);
				}
			})
		},
		
		deleteSubscribe: function (clubname){
			$.ajax({
				type: "DELETE",
				url: "/api/users/club/" + clubname,
				success: function (response) {
					if (response.deleteItem === true) {
						Home.getNewsList();
					}
				}
			})
		},

		getNewsList: function (){
			var makeHtml = function(response){
				var html = "";
				for (var i = 0; i < response.length; i++) {
					html += "<div class=\"oneNews\"><h3 class=\"title\">";
        	html += response[i].title;
        	html += "</h3><p class=\"newsClubname\">";
        	html += response[i].clubname;
        	html += "</p><p class=\"newsContent\">";
        	html += response[i].content;
        	html += "</p><p class=\"newsDate\">";
        	html += response[i].createDate;
        	html += "</p></div>";
				}
				$('section.content').html(html);
			}
			$.ajax({
				type: "GET",
				url: "/api/users/news",
				success: function (response) {
					makeHtml(response);
				}
			})
		},

		getSearchNewsList: function (term){
			var makeHtml = function(response){
				var html = "";
				for (var i = 0; i < response.length; i++) {
					html += "<div class=\"oneNews\"><h3 class=\"title\">";
        	html += response[i].title;
        	html += "</h3><p class=\"newsClubname\">";
        	html += response[i].clubname;
        	html += "</p><p class=\"newsContent\">";
        	html += response[i].content;
        	html += "</p><p class=\"newsDate\">";
        	html += response[i].createDate;
        	html += "</p></div>";
				}
				$('section.content').html(html);
			}
			$.ajax({
				type: "GET",
				url: "/api/users/news/search/" + term,
				success: function (response) {
					makeHtml(response);
				},
				error: function (err) {
					console.log(err);
				}
			})
		}

	}

	Home.getSubscribe();
	Home.getUserInfo();
	Home.getNewsList();

	$(document).on('click', '.sign_out', function(){
		event.preventDefault();
		Home.signOut();
	})

	$(document).on('click', '.goAddClub', function(){
		event.preventDefault();
		var code = $('input[name="club-code"]').val();
		Home.addSubscribe(code);
		$('input[name="club-code"]').val("");
	})

	$(document).on('click', 'span.subscribedClub a[name]', function (){
		var clubname = $(this).attr('name');
		Home.deleteSubscribe(clubname);
		setTimeout(function(){
			Home.getSubscribe();
		}, 100)
	})

	$(document).on('keyup', '.searchContent', function(){
			var term = $('.searchContent').val();
			if (term != '') {
				Home.getSearchNewsList(term);
			} else {
				Home.getNewsList();
			}
	})

})