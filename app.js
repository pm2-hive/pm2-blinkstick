var pmx = require('pmx');
var fs = require('fs');
var request = require('request');
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
    return interpolate(formula);
  }

  function rec() {
    led.pulse(getColor(), opts, function(){
      setTimeout(rec, blink_val * 0.8);
    });
  }

  rec();

  setInterval(function() {
    request.get("http://" + conf.ip + ":" + conf.port, function(err, res) {
      if (!err) {
        console.log(res.body);
        blink_val = res.body;
        opts.duration = blink_val * 0.8;
      }
    });
  }, 1000);
});
