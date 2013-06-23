// Try to get the token from the local storage.
// If we get a token, than we set-up the event listeners
// on the tabs.
Mooment.user.readToken(function(response) {
  if( typeof response.token !== "string" ) {
    // TODO: Set-up a consistent way to handle errors in the backend
    console.log( "An invalid response was received: " + response.toString() );
    return;
  }
  Mooment.monitor.start();
});