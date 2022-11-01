'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class CO2monitor extends ZwaveDevice {

  async onNodeInit() {
    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    // register device capabilities
    this.registerCapability('measure_co2', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
      report: 'SENSOR_MULTILEVEL_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)')) {
          if (report['Sensor Type'] === 'CO2-level (version 3)') {
            this.setCapabilityValue('alarm_co2', report['Sensor Value (Parsed)'] >= (this.getSetting('CO2_notification') || 1200)).catch(this.error);
            return report['Sensor Value (Parsed)'];
          }
        }
        return null;
      },
    });

    // register device capabilities
    this.registerCapability('alarm_co2', 'NOTIFICATION', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
    });
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
    });
    this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
    });
  }

}

module.exports = CO2monitor;
