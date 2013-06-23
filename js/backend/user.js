Mooment.user = (function () {

  var token;

  function authenticate(credentials,callback) {
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
    chrome.storage.sync.set({"token": token}, callback);
  }

  /**
   * reads the token from the local storage
   * @param  {Function} callback The function to pass the
   *                             result and to execute the callback
   */
  function readToken(callback) {
    chrome.storage.sync.get("token",callback);
  }

  return {
    authenticate: authenticate,
    setToken: setToken,
    readToken: readToken,
    cacheToken: cacheToken,
    getToken: getToken
  };
}());