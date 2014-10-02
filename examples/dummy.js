// Start
var express = require('express');
var app = express();
var rest = require('./../index.js')(app);

rest.set_id('34f5eQ');
rest.set_name('my_new_device');

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

var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});