// Try to get the token from the local storage.
// If we get a token, than we set-up the event listeners
// on the tabs.
// TODO: Move the icon setters someplace else
ProcDoc.user.readToken(function(response) {
  if (typeof response.token === "string" ) {
    ProcDoc.user.cacheToken(response.token);
    ProcDoc.monitor.start();
  } else {
		chrome.browserAction.setIcon({
   		"path": {
	      "19": "images/icon19-red.png",
	      "38": "images/icon38-red.png"
   		}
    });
  }
});