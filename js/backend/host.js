ProcDoc.host = (function() {

  // Every time we access a function the now variable will be
  // set, this is because the timestamps should not be dependent
  // upon the execution times of the asynchronous functions
  var now,
    // String constants
    RECORDED_HOST = "[RECORDED-HOST]",
    ACTIVE_HOST = "[ACTIVE-HOST]";

  /**
   * Tries to find a recorded instance of a host.
   * Returns the result as an object in the callback
   * chrome.storage.local.get(null, function(recordings){console.log(recordings['[RECORDED-HOST]...']);} );
   */

  function getRecorded(name, callback) {
    chrome.storage.local.get(RECORDED_HOST + name, callback);
  }

  /**
   * Tries to fetch the active record. There should be only one.
   * It is returned as an object using a callback
   * chrome.storage.local.get(null, function(recordings){console.log(recordings['[ACTIVE-HOST]']);} );
   */

  function getActive(callback) {
    chrome.storage.local.get(ACTIVE_HOST, callback);
  }

  function getValidFinish(start, finish) {
    var startMoment = moment(start);
    var finishMoment = moment(finish);
    if (((finishMoment - startMoment) / (1000 * 60)) <= (ProcDoc.sanitizeInterval * 2)) {
      return finish;
    }
    finishMoment = startMoment.add('minutes', ProcDoc.sanitizeInterval);
    return finishMoment.toISOString();
  }

  /**
   * Add a new interval to the archive for a host
   */

  function addInterval(callback, activeRecord, archivedRecord) {
    var recordings = [],
      hostKey;
    // Test to see if the object is empty. If it is empty, it means
    // that it is being recorded for the first time, so there are no
    // previous recordings
    if (Object.keys(archivedRecord).length === 0) {
      recordings = [];
    } else {
      try {
        // Try to get the old recordings in an array format
        recordings = JSON.parse(archivedRecord[RECORDED_HOST + activeRecord[ACTIVE_HOST].host]);
      } catch (ex) {
        // If there was any problem, just start from scratch
        recordings = [];
      }
    }

    // Add the new recording
    // TODO: don't record anything shorter than 5 seconds
    recordings.push({
      "start": activeRecord[ACTIVE_HOST].start,
      "finish": getValidFinish(activeRecord[ACTIVE_HOST].start, now.toISOString())
    });

    console.log('Pushing ' + activeRecord[ACTIVE_HOST].host + ' start: ' + activeRecord[ACTIVE_HOST].start + ' finish: ' + getValidFinish(activeRecord[ACTIVE_HOST].start, now.toISOString()));

    // We record intervals that have a maximum length, so that we
    // don't end up having any surprises
    var recordToSave = {};
    recordToSave[RECORDED_HOST + activeRecord[ACTIVE_HOST].host] = JSON.stringify(recordings);
    chrome.storage.local.set(recordToSave, callback);
  }

  /**
   * Moves an interval from the active state
   * to the recorded tate
   */

  function commitInterval() {
    // Get the current active record if it exists.
    getActive(function(record) {
      // Check to see if there is an active record object.
      // If there is no active record, we can call the callback directly.
      if (Object.keys(record).length === 0) {
        return;
      }
      // Bind hell
      unsetActiveHost(
        setActiveHost.bind(
          this,
          record[ACTIVE_HOST].host,
          getRecorded.bind(
            this,
            record[ACTIVE_HOST].host,
            addInterval.bind(
              this,
              undefined,
              record
            )
          )
        )
      );
    });
  }

  function removeActive(callback) {
    // Get the current active record if it exists.
    getActive(function(record) {
      // Check to see if there is an active record object.
      // If there is no active record, we can call the callback directly.
      if (Object.keys(record).length === 0) {
        callback();
        return;
      }
      // If there is an active record, try to see if it is not
      // already present in the archive and than add it
      getRecorded(record[ACTIVE_HOST].host, addInterval.bind(this, callback, record));
    });
  }

  function unsetActiveHost(callback) {
    chrome.storage.local.remove(ACTIVE_HOST, callback);
  }

  /**
   * Stops the current task and saves it
   */

  function setInactive(callback) {
    // Get the current active record if it exists.
    getActive(function(record) {
      // Check to see if there is an active record object.
      // If there is no active record, we can call the callback directly.
      if (Object.keys(record).length === 0) {
        callback();
        return;
      }
      // If there is an active record, try to see if it is not
      // already present in the archive and than add it
      getRecorded(record[ACTIVE_HOST].host, addInterval.bind(this, callback, record));
    });
  }

  function setActiveHost(host, callback) {
    // If there's an error while writing to the storage, it will not be
    // signaled with the callback, but with runtime.lastError (not nice Google)
    var recordToSave = {};
    recordToSave[ACTIVE_HOST] = {
      "host": host,
      "start": now.toISOString()
    };
    chrome.storage.local.set(recordToSave, callback);
  }

  return {
    setActive: function(host, callback) {
      // use a global now object so we are not dependent on
      // asynchronous calls
      now = new Date();

      // The first step to making a host active is to make the
      // previous host inactive
      setInactive(setActiveHost.bind(this, host, callback));
    },
    unsetActive: function(callback) {
      // use a global now object so we are not dependent on
      // asynchronous calls
      now = new Date();
      removeActive(unsetActiveHost.bind(this, callback));
    },
    sanitizeActive: function(callback) {
      // use a global now object so we are not dependent on
      // asynchronous calls
      now = new Date();
      commitInterval();
    }
  };
}());
