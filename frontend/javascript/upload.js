////JQUERY for ajax calls to the server / handling api calls
$(function(){
  $("#output").val("Welcome to the pi cluster api, type /help/ for assistance. \n");

  $('#fileinfo').on('submit', function (event) {
    var form = new FormData();
    //upload the first file that is in the form ( enforced in the html but just to be safe1)
    form.append("file", $("#input")[0].files[0]);

    event.preventDefault(); // Stop the form from causing a page refresh.
    // create req header and send it through AJAX
    $.ajax({
      url: '/api/v1/upload',
      data: form,
      method: 'POST',
      contentType: false,
      processData: false,
      success: function(data){
        $("#output").val(data.message);
      }
    })
  });
  // used to parse values within text to pass into api calls
  $(document).keypress(function(e) {
    // listens for the enter key to be pressed
    if(e.which == 13) {
      var text = document.getElementById('output');
      var regex = new RegExp(/\/([a-zA-Z0-9]{0,})\//ig);
      var matches;
      if(matches = text.value.match(regex)){
          matches.forEach(function(commands){
              if(commands === "/help/"){
                $.ajax({
                  url: '/api/v1/help',
                  method: 'GET',
                  contentType: false,
                  processData: false,
                  success: function(data){
                    $('#output').val(data.message + "\n");
                  }
                })
              }
              if(commands === "/resources/"){
                $.ajax({
                  url: '/api/v1/resources',
                  method: 'GET',
                  contentType: false,
                  processData: false,
                  success: function(data){
                    $('#output').val(data.message + "\n");
                  }
                })
              }
              if(commands === "/clear/"){
                $("#output").val("");
              }
          });
      }
    }
  });

});
