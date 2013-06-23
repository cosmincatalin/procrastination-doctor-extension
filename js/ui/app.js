$("document").ready(init);

function init() {

  $("#login").click(function () {
    Mooment.extension.user.authenticate({ "email": $("#email").val(), "password": $("#password").val() }, function(err, response){
      if (err) {
        // TODO: Handle the callback errors gracefully
        console.log(err);
        return;
      }
      // Now that we have the token from the authentication, we need to save it
      // in the local storage( and cahe it).
      Mooment.extension.user.setToken(response.token);
      Mooment.extension.startMonitoring();
    });
  });

}