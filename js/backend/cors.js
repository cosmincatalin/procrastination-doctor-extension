Mooment.cors = {

  makeRequest: function(http_method, path, data, callback) {
    var url = "http://localhost:3001/api/" + path;
    var attrs = {
      type: http_method,
      url: url,
      timeout: 1000 * 30,
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      },
      accept: "application/json",
      success: function(data, status, xhr) {
        callback(null, data);
      },
      error: function(xhr, status, error) {
        if (status === "error" && xhr.responseText) {
          var response;
          try {
            response = $.parseJSON(xhr.responseText);
            switch (typeof response.errors) {
            case "string":
              response.errors = [ response.errors ];
              break;
            case "undefined":
              response.errors = [ "Could not parse response from server" ];
              break;
            }
          } catch (e) {
            response = {
              "errors": [ "Could not parse response from server" ]
            };
          }
          response.status = xhr.status;
          callback(response);
        } else {
          callback({ "errors": [ error], "status": status });
        }
      },
      xhrFields: {
        withCredentials: true
      }
    };
    if (http_method === "POST" || http_method === "PUT") {
      attrs.data = JSON.stringify(data);
      attrs.dataType = "json";
      attrs.processData = false;
      attrs.contentType = "application/json";
    }
    $.ajax(attrs);
  }
};