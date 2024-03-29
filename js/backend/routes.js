// Defines the public routes
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  /**
   * Since the callback of the onMessage handler accepts only
   * one parameter, we have to pack the response before calling
   * the function
   */

  function prepareAndSendCallbackResponse(err, response) {
    // If there's no callback set, it makes no sense to call it
    if (sendResponse) {
      sendResponse({
        "err": err,
        "response": response
      });
    }
  }

  switch (request.controller) {
    // User Controller
    case "user":
      switch (request.action) {
        case "authenticate":
          ProcDoc.user.authenticate(request.params, prepareAndSendCallbackResponse);
          break;
        case "logInWebInterface":
          ProcDoc.user.logInWebInterface(prepareAndSendCallbackResponse);
          break;
        case "register":
          ProcDoc.user.register(request.params, prepareAndSendCallbackResponse);
          break;
        case "setToken":
          ProcDoc.user.setToken(request.params, prepareAndSendCallbackResponse);
          break;
        case "getToken":
          prepareAndSendCallbackResponse(null, ProcDoc.user.getToken(request.params));
          break;
        case "logout":
          ProcDoc.user.logout({
            "token": ProcDoc.user.getToken()
          }, prepareAndSendCallbackResponse);
          break;
        case "resetPassword":
          ProcDoc.user.resetPassword(request.params, prepareAndSendCallbackResponse);
          break;
      }
      break;
      // Monitor Controller
    case "monitor":
      switch (request.action) {
        case "startMonitoring":
          ProcDoc.monitor.start(prepareAndSendCallbackResponse);
          break;
      }
      break;
  }
  // This means that the extension will use the
  // sendResponse callback to return data
  return true;
});
