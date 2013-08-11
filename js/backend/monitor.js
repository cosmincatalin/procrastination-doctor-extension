Mooment.monitor = (function() {
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
  }

  return {
    start: start
  };
}());