// Create the namespace
ProcDoc = {};
if ( true ) {
  ProcDoc.apiUrl = 'https://api.procrastination-doctor.com/';
  ProcDoc.appUrl = 'https://app.procrastination-doctor.com/';
  ProcDoc.idleTime = 12;
  ProcDoc.sendInterval = 14;
  ProcDoc.sanitizeInterval = 10;
} else {
  ProcDoc.apiUrl = 'http://localhost:3001/';
  ProcDoc.appUrl = 'http://mooment/';
  ProcDoc.idleTime = 3;
  ProcDoc.sendInterval = 5;
  ProcDoc.sanitizeInterval = 2;
}