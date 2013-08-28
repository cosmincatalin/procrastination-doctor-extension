$("document").ready(init);

/**
 * The UI side is not really optimized AT ALL,
 * though, the footprint of the code is really
 * small and there are no performance losses.
 */
function init() {

  var goToLogin = function() {
    $.get("js/ui/templates/login.html", function(template) {
      powerOffRegister();
      $("body").html(Mustache.render(template));
      powerOnLogin();
    });
  };

  var goToRegister = function() {
    $.get("js/ui/templates/register.html", function(template) {
      powerOffLogin();
      $("body").html(Mustache.render(template));
      powerOnRegister();
    });
  };

  var powerOffRegister = function() {
    $("#register").unbind("click");
    $("#goToLogin").unbind("click");
  };

  var powerOnRegister = function() {
    $("#register").click(function () {
      Mooment.extension.user.register({ "email": $("#email").val(), "password": $("#password").val() }, function(err, response){
        if (err) {
          // TODO: Handle the callback errors gracefully
          console.log(err);
          return;
        }
        console.log("success register");
        goToLogin()
      });
    });
    $("#goToLogin").click(goToLogin);
  };

  var powerOffLogin = function() {
    $("#login").unbind("click");
    $("#goToRegister").unbind("click");
  };

  var powerOnLogin = function() {
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
    $("#goToRegister").click(goToRegister);
  };

  $.get("js/ui/templates/login.html", function(template) {
    $("body").html(Mustache.render(template));
    powerOnLogin();
  });

}