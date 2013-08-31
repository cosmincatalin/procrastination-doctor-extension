// This object is responsible to send the actions to the extension backed.
// It works like a tunnel, since this is the only way of communicating to
// the eventPages defined in the scripts section
Mooment.extension = (function () {

  /**
   * Activates the event handlers used for monitoring
   */
  function startMonitoring() {
    chrome.runtime.sendMessage({ "controller": "monitor", "action": "startMonitoring" });
  }

  /**
   * Authenticate a user using the email and password provided.
   * A callback with the status of the authentication is called
   * at the end.
   * @param  {Object}   credentials An object with an email and password field
   * @param  {Function} callback    The function to execute with the response of the authentication
   */
  function authenticate(credentials, callback) {
    chrome.runtime.sendMessage({ "controller": "user", "action": "authenticate", "params": credentials }, function(envelopedResponse) {
      if (callback) {
        callback(envelopedResponse.err, envelopedResponse.response);
      }
    });
  }

  function register(credentials, callback) {
    chrome.runtime.sendMessage({ "controller": "user", "action": "register", "params": credentials }, function(envelopedResponse) {
      if (callback) {
        callback(envelopedResponse.err, envelopedResponse.response);
      }
    });
  }

  /**
   * Saves the user token in the persistent storage and also caches it.
   * The callback to this operation is optional
   */
  function setToken(token, callback) {
    chrome.runtime.sendMessage({ "controller": "user", "action": "setToken", "params": token }, function(envelopedResponse) {
      if (callback) {
        callback(envelopedResponse.err, envelopedResponse.response);
      }
    });
  }

  function isLoggedIn(callback) {
    chrome.runtime.sendMessage({ "controller": "user", "action": "getToken" }, function(envelopedResponse) {
      if (callback) {
        callback(
          envelopedResponse.err,
          typeof envelopedResponse.response === "string" && envelopedResponse.response.length > 0 ? true : false
        );
      }
    });
  }

  return {
    startMonitoring: startMonitoring,
    user: {
      authenticate: authenticate,
      setToken: setToken,
      register: register,
      isLoggedIn: isLoggedIn
    }
  };
}());