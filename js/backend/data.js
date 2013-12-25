ProcDoc.data = (function () {

  var reKey = /\[RECORDED-HOST\](.*)/;

  function filterData(callback, recordings) {
    var host,
      filteredRecordings = [],
      hostParts,
      intervals;
    for (host in recordings) {
      try {
        hostParts = host.match(reKey);
        if ( hostParts ) {
          intervals = JSON.parse(recordings[host]);
          filteredRecordings.push({
            "host": hostParts[1],
            "intervals": intervals
          });
        }
      } catch (ex) { }
    }
    callback({
      "recordingType": "web-usage",
      "recordings": filteredRecordings
    });
  }

  function truncateData(callback, recordings) {
    var recording,
      recordingsToRemove = [];
    for (recording in recordings) {
      if ( recording.match( reKey ) ) {
        recordingsToRemove.push(recording);
      }
    }
    if ( recordingsToRemove.length > 0 ) {
      chrome.storage.local.remove( recordingsToRemove, callback );
    }
  }

  function extractData(callback, executor) {
    chrome.storage.local.get(null, executor.bind(this, callback));
  }

  function send(callback, data) {
    ProcDoc.cors.makeRequest("POST", "recording", data, callback);
  }

  return {
    send: function(callback) {
      extractData(send.bind(this, callback), filterData);
    },
    truncate: function(callback) {
      extractData(callback, truncateData);
    }
  };
}());