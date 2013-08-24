Mooment.data = (function () {

  function filterData(callback, recordings) {
    var host,
      filteredRecordings = [],
      re = /\[RECORDED-HOST\](.*)/,
      hostParts,
      intervals;
    for (host in recordings) {
      try {
        hostParts = host.match(re);
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
    var recording;
    for (recording in recordings) {
      console.log(recording)
    }
  }

  function extractData(callback, executor) {
    chrome.storage.local.get(null, executor.bind(this, callback));
  }

  function send(callback, data) {
    Mooment.cors.makeRequest("POST", "recording", data, callback);
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