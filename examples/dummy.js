// Start
var express = require('express');
var app = express();
var rest = require('./../index.js')(app);

// Set ID & name
var name = process.argv[3] || 'my_new_device';
var id = process.argv[4] || '34f5eQ';
rest.set_id(id);
rest.set_name(name);

//rest.set_serial_port('/dev/slave');
//rest.start_serial(9600);

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

// Connect via Websockets
rest.connect_ws('http://localhost:3000', server.address().port);
//rest.connect_ws('http://marcolivier-arest-cloud-test.jit.su/', server.address().port);