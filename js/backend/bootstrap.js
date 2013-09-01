// Try to get the token from the local storage.
// If we get a token, than we set-up the event listeners
// on the tabs.
Mooment.user.readToken(function(response) {
  if (typeof response.token === "string" ) {
    Mooment.user.cacheToken(response.token);
    Mooment.monitor.start();
  }
});