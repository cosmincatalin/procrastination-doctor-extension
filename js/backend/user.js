Mooment.user = (function() {

  var token;

  function authenticate(credentials, callback) {
    Mooment.cors.makeRequest("POST", "user/login", credentials, callback);
  }

  // Gets the value of the token from the cache

  function getToken() {
    return token;
  }

  function cacheToken(tokenVal) {
    token = tokenVal;
  }

  /**
   * Sets the value of the token into the local storage.
   * Also, set-up a cached variable to be used through out
   * the session lifetime
   * @param {String}   token    The string to be saved
   */

  function setToken(token, callback) {
    cacheToken(token);
    chrome.storage.sync.set({
      "token": token
    }, callback);
  }

  function logInWebInterface(callback) {
    Mooment.cors.makeRequest("GET", "user/token", callback);
  }

  /**
   * reads the token from the local storage
   * @param  {Function} callback The function to pass the
   *                             result and to execute the callback
   */

  function readToken(callback) {
    chrome.storage.sync.get("token", callback);
  }

  function register(credentials, callback) {
    Mooment.cors.makeRequest("POST", "user", credentials, callback);
  }

  function resetPassword(params, callback) {
    Mooment.cors.makeRequest("DELETE", "user/password", params, callback);
  }

  function logout(data, callback) {
    /**
     * Wrap the callback function so that no matter the response
     * the token gets removed anyway and the monitor is stopped
     */
    Mooment.cors.makeRequest("POST", "user/logout", data, function() {
      setToken(null);
      Mooment.monitor.stop();
      callback.apply(null, arguments);
    });
  }

  return {
    authenticate: authenticate,
    setToken: setToken,
    readToken: readToken,
    cacheToken: cacheToken,
    getToken: getToken,
    register: register,
    logout: logout,
    resetPassword: resetPassword,
    logInWebInterface: logInWebInterface
  };
}());