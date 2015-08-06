$(document).ready(function(){
  var Admin = function (){

  }

  Admin.prototype.getAddNewsInfo = function(){
    var addNewsInfo = {
        title: $('.addANews #newsTitle').val(),
        content: $('.addANews #newsContent').val(),
        clubcode: $('.addANews #clubcode').val()
    }
    return addNewsInfo;
  }

  Admin.prototype.getAddAClubInfo = function(){
    var addClubInfo = {
      club: {
        clubname: $('.addAClub #newClub').val(),
        clubcode: $('.addAClub #newClubcode').val()
      }
    }
    return addClubInfo;
  }

  Admin.prototype.submitNewNews = function (){
    var addNewsInfo = this.getAddNewsInfo();

    $.ajax({
      type: "POST",
      url: "/api/news",
      data: addNewsInfo,
      success: function (response) {
        if (response.insertfail === false){
          console.log('happy!'); 
          $('.addANews #newsTitle').val("");
          $('.addANews #newsContent').val("");
          $('.addANews #clubcode').val("");
        }
      }
    })
  }

  Admin.prototype.submitNewClub = function (){
    var addClub = this.getAddAClubInfo();

    $.ajax({
        type: "POST",
        url: "/api/clubs",
        data: addClub,
        success: function (response) {
          if (response.addclub === true) {
          console.log('happy!');
          $('.addAClub #newClub').val("");
          $('.addAClub #newClubcode').val("");
        }
      }
    })
  }

  Admin.prototype.showHint = function (){
    var input = {
      input: $('.addANews #clubcode').val()
    }

    $.ajax({
      type: "POST",
      url: "/api/admin/club",
      data: input,
      success: function (response){
        $('.addANews p.clubname').text(response.hint);
      },
      error: function(err) {
        $('.addANews p.clubname').text("");
      }
    })
  }

  var admin = new Admin ();

  $(document).on('click', '.addANews .newNews', function (){
    event.preventDefault();
    admin.submitNewNews();
  })

  $(document).on('click', '.addAClub .newClub', function (){
    event.preventDefault();
    admin.submitNewClub();
  })

  $(document).on('keyup', '.addANews #clubcode', function (){
    admin.showHint();
  })

  $(document).on('click', '.addAClub .back', function (){
    console.log('hihi!');
    event.preventDefault();
    window.location.replace('/');
  })

})