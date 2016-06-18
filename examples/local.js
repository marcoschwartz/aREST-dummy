// Start
var express = require('express');
var app = express();
var rest = require('./../index.js')(app);

// Set ID & name
var name = process.argv[3] || 'my_new_device';
var id = process.argv[4] || '34f5eQ';
rest.set_id(id);
rest.set_name(name);

temperature = 24;
humidity = 40;
rest.variable('temperature',temperature);
rest.variable('humidity',humidity);

rest.function("led",function(command) {

  // Get state from command
  state = parseInt(command);

  rest.digitalWrite(6,state);

  return 1;
});

// Define port & start server
port = process.argv[2] || 3000;
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
