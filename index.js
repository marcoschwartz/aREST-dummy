// aREST class
var device = {
  id: '001',
  name: 'my_device',
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
    
    // All
    app.get('/', function(req, res){
      
      var answer = new Object();
      answer.id = device.id;
      answer.name  = device.name;
      answer.variables = device.variables;
      answer.connected = true;
      
      res.json(answer);
    });

    // Variables
    app.get('/:variable', function(req, res){

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

      res.json(answer);
    });

    // Mode
    app.get('/mode/:pin/:state', function(req, res){

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
      res.json(answer);
    });

    // Digital write
    app.get('/digital/:pin/:state', function(req, res){

      var answer = new Object();

      answer.id = device.id;
      answer.name  = device.name;
      answer.connected = true;

      answer.message = 'Pin D' + req.params.pin + ' set to ' + req.params.state;

      // Set state
      device.digital_pins[req.params.pin] = parseInt(req.params.state);

      // Send answer
      res.json(answer);
    });

    // Analog write
    app.get('/analog/:pin/:state', function(req, res){

      var answer = new Object();

      answer.id = device.id;
      answer.name  = device.name;
      answer.connected = true;

      answer.message = 'Pin D' + req.params.pin + ' set to ' + req.params.state;

      // Send answer
      res.json(answer);
    });

    // Digital read
    app.get('/digital/:pin', function(req, res){

          // Get value
          value = device.digital_pins[req.params.pin];
    
          var answer = new Object();
          answer.id = device.id;
          answer.name  = device.name;
          answer.connected = true;
          answer.return_value = value;
          res.json(answer);
    });

    // Analog read
    app.get('/analog/:pin', function(req, res){

          // Get value
          value = device.analog_pins[req.params.pin];
    
          var answer = new Object();
          answer.id = device.id;
          answer.name  = device.name;
          answer.connected = true;
          answer.return_value = value;
          res.json(answer);
    });

  return {
    set_id: function(new_id) {
      device.id = new_id;
    },
    set_name: function(new_name) {
      device.name = new_name;
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