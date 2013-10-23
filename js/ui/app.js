$("document").ready(init);

/**
 * The UI side is not really optimized AT ALL,
 * though, the footprint of the code is really
 * small and there are no performance losses.
 */
function init() {

  var goToMain = function() {
    $.get("js/ui/templates/main.html", function(template) {
      powerOffLogin();
      $("body").html(Mustache.render(template));
      powerOnMain();
    });
  };

  var powerOffMain = function() {
    $("#logout").unbind("click");
  };

  var powerOnMain = function() {
    $("#logout").click(function () {
      Mooment.extension.user.logout(function(err, response){
        if (err) {
          // TODO: Handle the callback errors gracefully
          console.log(err);
          return;
        }
        goToLogin();
      });
    });
  };

  var goToLogin = function() {
    $.get("js/ui/templates/login.html", function(template) {
      powerOffRegister();
      powerOffMain();
      $("body").html(Mustache.render(template));
      powerOnLogin();
    });
  };

  var powerOffLogin = function() {
    $("#login").unbind("click");
    $("#goToRegister").unbind("click");
  };

  var powerOnLogin = function() {
    $("#login").click(function () {
      $(".text").removeClass("glow");
      Mooment.extension.user.authenticate({ "email": $("#email").val(), "password": $("#password").val() }, function(err, response){
        if (err) {
          // TODO: Handle the callback errors gracefully
          console.log(err);
          $(".text").addClass("glow");
          return;
        }
        // Now that we have the token from the authentication, we need to save it
        // in the local storage( and cahe it).
        Mooment.extension.user.setToken(response.token);
        Mooment.extension.startMonitoring();
        goToMain();
      });
    });
    $("#goToRegister").click(goToRegister);
    $("#goToReset").click(goToReset);
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
      $(".error-indicator").hide();
      Mooment.extension.user.register({ "email": $("#email").val(), "password": $("#password").val() }, function(err, response){
        var i;
        if (err) {
          for ( i in err.errors) {
            if (err.errors[i].code === 1045) {
              $("#password-error").attr("title", err.errors[i].msg).show(500);
            }
            if (err.errors[i].code === 2424) {
              $("#email-error").attr("title", err.errors[i].msg).show(500);
            }
          }
          console.log(err);
          return;
        }
        goToLogin();
      });
    });
    $("#goToLogin").click(goToLogin);
  };

  var goToReset = function() {
    $.get("js/ui/templates/reset.html", function(template) {
      powerOffLogin();
      $("body").html(Mustache.render(template));
      powerOnReset();
    });
  };

  var powerOffReset = function() {
    $("#reset").unbind("click");
    $("#goToLogin").unbind("click");
  };

  var powerOnReset = function() {
    $("#reset").click(function () {
      Mooment.extension.user.resetPassword({ "email": $("#email").val() }, function(err, response){
        if (err) {
          // TODO: Handle the callback errors gracefully
          console.log(err);
          return;
        }
        console.log("Reset password request sent");
        // At this point, if the email was a Gmail or Yahoo address,
        // the extension should be closed and Gmail opened automatically
        // Otherwise, just show an explinatory email
      });
    });
    $("#goToLogin").click(goToLogin);
  };

  Mooment.extension.user.isLoggedIn( function(flag) {
    if ( flag ) {
      goToMain();
    } else {
      goToLogin();
    }
  } );

}