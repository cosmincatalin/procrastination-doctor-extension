Mooment.monitor = (function() {
  // The interval id for the task that sends data to the server
  var intervalId;

  function send(callback) {
    console.log('Sending to API');
    chrome.storage.local.get(null, function(recordings) {
      console.log(recordings);
    });
    // TODO: Think about implementing Q to avoid callback hell
    Mooment.data.send(function(err) {
      if (err !== null) {
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
    console.log('Stopping the monitor');
    clearInterval(intervalId);
    intervalId = undefined;
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

  function getCurrentTab(callback) {
    chrome.tabs.query({
      active: true
    }, callback);
  }

  // Go into callback/if hell

  function tabUpdatedHandler(tabId, changeInfo, tab) {
    // Need to look if the updated event was called from a tab
    // that is not the front-facing tab.
    var found = false;
    chrome.tabs.query({
      active: true,
      highlighted: true,
      lastFocusedWindow: true
    }, function(tabs) {
      for (var i = tabs.length - 1; i >= 0; i--) {
        if (tabs[i].id === tabId) {
          chrome.idle.queryState(1000 * 60 * Mooment.idleTime, function(state) {
            if (state === 'active') {
              console.log('Switching to active site ' + tab.url);
              // Only start monitoring once the page is completely loaded
              if (changeInfo.status === 'complete') {
                try {
                  Mooment.host.setActive(Mooment.util.getSite(tab.url));
                  // Silently ignore if the url fails to be parsed
                } catch (ex) {}
                found = true;
              }
            }
          });
          break;
        }
      };
    });
    if (!found) {
      console.log('Background domain called ' + tab.url);
    }
  }

  function tabActivatedHandler(activeInfo) {
    console.log('Swithing active site');
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      try {
        console.log('....' + tab.url);
        Mooment.host.setActive(Mooment.util.getSite(tab.url));
        // Silently ignore if the url fails to be parsed
      } catch (ex) {}
    });
  }

  function focusChanged(state) {
    switch (state) {
      case 506:
      case -1:
      case 'idle':
        console.log('Browser idle ' + state);
        Mooment.host.unsetActive();
        return;
        break;
      case 1:
      case 'active':
        console.log('Active ' + state);
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function(tabs) {
          try {
            Mooment.host.setActive(Mooment.util.getSite(tabs[0].url));
            // Silently ignore if the url fails to be parsed
          } catch (ex) {
            console.log('Unrecordable tab');
          }
        });
        break
      default:
        console.log('Unknown default idle ' + state);
        return;
    }
  }

  /**
   * After the token is saved in the synchronized store, that is,
   * the user is authenticated, start monitoring the web activities
   * and from time to time synchronize them with the server
   * @param  {Function} callback A function to be called after the
   *                             events and tasks are started.
   */

  function start(callback) {
    chrome.tabs.onUpdated.addListener(tabUpdatedHandler);
    chrome.tabs.onActivated.addListener(tabActivatedHandler);

    chrome.windows.onFocusChanged.addListener(focusChanged);

    chrome.idle.onStateChanged.addListener(focusChanged);

    /**
     * Start the recurring task that sends the statistics back to the server
     * TODO: Remove hardcoding
     */
    if (!(parseInt(intervalId) > 0)) {
      var interval = 1000 * 60 * Mooment.idleTime;
      console.log('Setting interval to every ' + interval / (1000 * 60) + ' minutes');
      intervalId = setInterval(send, interval);
    }

    // chrome.idle.setDetectionInterval( 15 * 60 );
    chrome.idle.setDetectionInterval(60);

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
