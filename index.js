// Requires
var request = require("request");
var WebSocket = require('ws');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

// aREST class
var device = {
  id: '001',
  name: 'my_device',
  serial_port: '',
  serial_speed: '',
  variables: {},
  functions: {},
  digital_pins: [],
  analog_pins: []
}

// Populate pins
for (i=0; i < 14; i++) {
  device.digital_pins.push(0);
}

for (i=0; i < 6; i++) {
  device.analog_pins.push(500);
}

// Exports
module.exports = function (app) {

    // Mode
    app.get('/mode/:pin/:state', function(req, res){

      console.log('Mode request');

      var answer = new Object();

      answer.id = device.id;
      answer.name  = device.name;
      answer.connected = true;

      if (req.params.state == 'i'){
        answer.message = 'Pin D' + req.params.pin + ' set to input';  
      }
      if (req.params.state == 'o'){
        answer.message = 'Pin D' + req.params.pin + ' set to output';
      }

      // Send answer
      console.log(answer);
      res.json(answer);
    });

    // Digital write
    app.get('/digital/:pin/:state', function(req, res){

      console.log('Digital write request');

      var answer = new Object();

      answer.id = device.id;
      answer.name  = device.name;
      answer.connected = true;

      answer.message = 'Pin D' + req.params.pin + ' set to ' + req.params.state;

      // Set state
      device.digital_pins[req.params.pin] = parseInt(req.params.state);

      // Send answer
      console.log(answer);
      res.json(answer);
    });

    // Analog write
    app.get('/analog/:pin/:state', function(req, res){

      console.log('Analog write request');

      var answer = new Object();

      answer.id = device.id;
      answer.name  = device.name;
      answer.connected = true;

      answer.message = 'Pin D' + req.params.pin + ' set to ' + req.params.state;

      // Send answer
      console.log(answer);
      res.json(answer);
    });

    // Digital read
    app.get('/digital/:pin', function(req, res){

        console.log('Digital read request');

          // Get value
          value = device.digital_pins[req.params.pin];
    
          var answer = new Object();
          answer.id = device.id;
          answer.name  = device.name;
          answer.connected = true;
          answer.return_value = value;

          console.log(answer);
          res.json(answer);
    });

    // Analog read
    app.get('/analog/:pin', function(req, res){

          console.log('Analog read request');

          // Get value
          value = device.analog_pins[req.params.pin];
    
          var answer = new Object();
          answer.id = device.id;
          answer.name  = device.name;
          answer.connected = true;
          answer.return_value = value;

          console.log(answer);
          res.json(answer);
    });

    // Variables
    app.get('/:variable', function(req, res){

      console.log('Variable or function request');

      var answer = new Object();

      answer.id = device.id;
      answer.name  = device.name;
      answer.connected = true;

      if (device.variables[req.params.variable]){
        answer[req.params.variable] = device.variables[req.params.variable];
      }

      if (device.functions[req.params.variable]){
        parameters = req.query.params;
        value = device.functions[req.params.variable](parameters);
        answer.return_value = value;
      }

      console.log(answer);
      res.json(answer);
    });

    // All
    app.get('/', function(req, res){

      console.log('Root request');
      
      var answer = new Object();
      answer.id = device.id;
      answer.name  = device.name;
      answer.variables = device.variables;
      answer.connected = true;
      
      console.log(answer);
      res.json(answer);
    });

  return {
    start_serial: function(serial_speed) {
      device.serial_speed = serial_speed;

      device.serialPort = new SerialPort(device.serial_port, {
        baudrate: serial_speed,
        parser: serialport.parsers.readline('\n')
      }, function(error){
        if (error){
          console.log("Error with request");
        }
      });

      // Handle Serial data
      device.serialPort.on("open", function () {
        console.log('Serial port opened');
        device.serialPort.on('close', function(data) {
          console.log('Serial port closed');
        });
        device.serialPort.on('data', function(data) {
          console.log('data received: ' + data);
          setTimeout(function(){
            device.serialPort.close();
          },500);
      });
      device.serialPort.write(Buffer('Works' + '\r'));
    });  

    },
    connect_ws: function(remote_server, port) {

      var ws = new WebSocket(remote_server);

      ws.on('open', function() {
        console.log('Opened WebSocket connection');

        ws.on('message', function(message) {
          console.log('Received command: %s', message);
          request('http://localhost:' + port + '/' + message, function(error, response, body) {
            console.log('Returned command: %s', body);
            ws.send(body);
          });
        });

      });
    
    },
    set_id: function(new_id) {
      device.id = new_id;
    },
    set_name: function(new_name) {
      device.name = new_name;
    },
    set_serial_port: function(serial_port) {
      device.serial_port = serial_port;
    },
    variable: function(variable_name,variable_value){
      device.variables[variable_name] = variable_value;  
    },
    function: function(function_name,function_value){
      device.functions[function_name] = function_value;
    },
    digitalWrite: function(pin,state) {
      device.digital_pins[pin] = state;
    }
  };
};