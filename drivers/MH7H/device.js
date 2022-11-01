'use strict';

const Thermostat_MH7 = require('../MH7/device');

class Thermostat_MH7H extends Thermostat_MH7 {

  async onNodeInit() {
    await super.async onNodeInit();

    // enable debugging
    this.enableDebug();

    // print the node's info to the console
    this.printNode();

    // registerCapability for measure_temperature for FW <=18.
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true,
        pollInterval: 'poll_interval_HUMIDITY',
        pollMultiplication: 60000,
      },
    });

    this.log('MH7H device driver MeshInit completed');
  }

}

module.exports = Thermostat_MH7H;
