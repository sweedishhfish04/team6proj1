// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  $('#search-button').attr('onclick', false);
}

// Search for a specified string.
function search() {
  var q = $('#query').val();
  $.ajax({
    cache: false,
    data: $.extend({
      key: 'AIzaSyDyHRg8b0c7wjwxUehG5YBpT6rsPgfH9ys',
      q: q,
      part: 'snippet'
    }, { maxResults: 20, pageToken: $("#pageToken").val() }),
    dataType: 'json',
    type: 'GET',
    timeout: 5000,
    url: 'https://www.googleapis.com/youtube/v3/search'
  })

  console.log(data)

}


// request.execute(function (response) {
//   var str = JSON.stringify(response.result);
//   $('#search-container').html('<pre>' + str + '</pre>');
// });