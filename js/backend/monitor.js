Mooment.monitor = (function() {
  // The interval id for the task that sends data to the server
  var intervalId;

  function send(callback) {
    // TODO: Think about implementing Q to avoid callback hell
    Mooment.data.send(function(err) {
      if ( err !== null ) {
        switch (err.code) {
          case 5343:
            stop();
            Mooment.user.setToken(null);
            return;
            break;
        }
      }
      Mooment.data.truncate();
    });
  }

  function stop() {
    clearInterval( intervalId );
    chrome.tabs.onUpdated.removeListener(tabUpdatedHandler);
    chrome.tabs.onActivated.removeListener(tabActivatedHandler);
    // TODO: Move this to a function
    chrome.browserAction.setIcon({
      "path": {
        "19": "images/icon19-red.png",
        "38": "images/icon38-red.png"
      }
    });
  }


  function tabUpdatedHandler(tabId, changeInfo, tab) {
      // Only start monitoring once the page is completely loaded
      if (changeInfo.status !== "complete" ) {
        return;
      }
      try {
        Mooment.host.setActive(Mooment.util.getSite(tab.url));
      // Silently ignore if the url fails to be parsed
      } catch (ex) { }    
  }

  function tabActivatedHandler(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      try{
        Mooment.host.setActive(Mooment.util.getSite(tab.url));
      // Silently ignore if the url fails to be parsed
      } catch (ex) { }
    });
  }

  function focusChanged(state) {
    if ( state === "active" ) {
      return;
    }
    Mooment.host.unsetActive();
  }

  /**
   * After the token is saved in the synchronized store, that is,
   * the user is authenticated, start monitoring the web activities
   * and from time to time synchronize them with the server
   * @param  {Function} callback A function to be called after the
   *                             events and tasks are started.
   */
  function start(callback) {
    chrome.tabs.onUpdated.addListener( tabUpdatedHandler );
    chrome.tabs.onActivated.addListener( tabActivatedHandler );
    chrome.windows.onFocusChanged.addListener( focusChanged );
    chrome.idle.onStateChanged.addListener( focusChanged );
    // TODO
    // chrome.tabs.onHighlighted.addListener( tabActivatedHandler );
    // chrome.tabs.onRemoved.addListener( tabActivatedHandler );
    // chrome.tabs.onAttached.addListener( tabActivatedHandler );
    // chrome.tabs.onDetached.addListener( tabActivatedHandler );
    // 

    /**
     * Start the recurring task that sends the statistics back to the server
     * TODO: Remove hardcoding
     */
    if ( !(parseInt( intervalId ) > 0 ) ) {
      intervalId = setInterval(send, 1000 * 600 );
    }

    chrome.idle.setDetectionInterval( 15 * 60 );

    // TODO: Move this to a function
    chrome.browserAction.setIcon({
      "path": {
        "19": "images/icon19.png",
        "38": "images/icon38.png"
      }
    });
    // TODO: Finally call the callback function to signal that starting has completed
  }

  return {
    start: start,
    stop: stop
  };
}());