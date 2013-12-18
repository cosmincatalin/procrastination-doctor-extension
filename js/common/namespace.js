// Create the namespace
Mooment = {};
if ( true ) {
  Mooment.apiUrl = 'https://api.procrastination-doctor.com/';
  Mooment.appUrl = 'https://app.procrastination-doctor.com/';
  Mooment.idleTime = 15;
} else {
  Mooment.apiUrl = 'http://localhost:3001/';
  Mooment.appUrl = 'http://mooment/';
  Mooment.idleTime = 1;
}