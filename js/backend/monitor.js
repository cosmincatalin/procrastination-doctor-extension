Mooment.monitor = (function() {
  // The interval id for the task that sends data to the server
  var intervalId;

  function send(callback) {
    console.log("Executing send task");
    // TODO: Think about implementing Q to avoid callback hell
    Mooment.data.send(function() {
      Mooment.data.truncate();
    });
  }

  /**
   * After the token is saved in the synchronized store, that is,
   * the user is authenticated, start monitoring the web activities
   * and from time to time synchronize them with the server
   * @param  {Function} callback A function to be called after the
   *                             events and tasks are started.
   */
  function start(callback) {
    chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab ) {
      // Only start monitoring once the page is completely loaded
      if (changeInfo.status !== "complete" ) {
        return;
      }
      try {
        Mooment.host.setActive(Mooment.util.getSite(tab.url));
      // Silently ignore if the url fails to be parsed
      } catch (ex) { }
    });
    chrome.tabs.onActivated.addListener(function(activeInfo) {
      chrome.tabs.get(activeInfo.tabId, function(tab) {
        try{
          Mooment.host.setActive(Mooment.util.getSite(tab.url));
        // Silently ignore if the url fails to be parsed
        } catch (ex) { }
      });
    });

    /**
     * Start the recurring task that sends the statistics back to the server
     * TODO: Remove hardcoding
     */
    interval = setInterval(send, 1000 * 30 );
    // TODO: Finally call the callback function to signal that starting has completed
  }

  return {
    start: start
  };
}());