var pmx = require('pmx');
var fs = require('fs');
var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var blinkstick = require('blinkstick');
var interpolate = require('./interpolate.js');

pmx.initModule({

  widget : {

	  logo : 'https://mdn.mozillademos.org/files/3563/HTML5_Logo_128.png',

    theme : ['#262E35', '#1B2228', '#807C7C', '#807C7C'],

    el : {
      probes  : true,
      actions : true
    },

    block : {
      actions : false,
      issues  : true,
      meta    : true,

      main_probes : []
    }

  }

}, function(err, conf) {
  //Blinkstick setup
var led = blinkstick.findFirst();
led.turnOff();

var blink_val = 1400;

var current_value = 0;

//'#0DFF05';

var opts = {
  duration : blink_val * 0.8,
  steps    : 100
};

function getColor() {
  var formula = 140 - (blink_val / 10);
  console.log(formula);
  return interpolate(formula);
}

function rec() {
  led.pulse(getColor(), opts, function(){
    setTimeout(rec, blink_val * 0.8);
  });
}

rec();

  //Server setup
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded ({ extended: true }));
  app.get('/', function(req, res) {
    res.send('listening');
  });
  app.post('/', function(req, res) {
    console.log(req.body.status);
    blink_val = req.body.status;
    opts.duration = blink_val * 0.8;
    res.send('received');
  });
  app.listen(conf.port);
});
