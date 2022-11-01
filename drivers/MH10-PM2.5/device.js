'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class PM25monitor extends ZwaveDevice {

  async onNodeInit() {
    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    // register device capabilities
    this.registerCapability('measure_pm25', 'SENSOR_MULTILEVEL', {

      // << containment for error in report handling of Particulate Matter 2.5 (v7)
      report: 'SENSOR_MULTILEVEL_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Sensor Value (Parsed)')) {
          if (report.hasOwnProperty('Sensor Type')) {
            console.log('Sensor Type: ', report['Sensor Type']); // debugging only
            if (report['Sensor Type'] === 'Particulate Matter 2.5 (v7)') {
              this.setCapabilityValue('alarm_pm25', report['Sensor Value (Parsed)'] >= (this.getSetting('PM2.5_notification') || 800)).catch(this.error);
              return report['Sensor Value (Parsed)'];
            }
          }
          if (report.hasOwnProperty('Sensor Type (Raw)')) {
            console.log('Sensor Type (RAW): ', report['Sensor Type (Raw)'][0]); // debugging only
            if (report['Sensor Type (Raw)'][0] === 35) {
              this.setCapabilityValue('alarm_pm25', report['Sensor Value (Parsed)'] >= (this.getSetting('PM2.5_notification') || 800)).catch(this.error);
              return report['Sensor Value (Parsed)'];
            }
          }
        }
        return null;
      },
      // >> containment for error in report handling of Particulate Matter 2.5 (v7)

      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
    });
    // register device capabilities
    /* this.registerCapability('alarm_pm25', 'NOTIFICATION', {
			getOpts: {
				getOnStart: true, // get the initial value on app start
				//pollInterval: 'poll_interval' // maps to device settings
			}
		}); */
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

module.exports = PM25monitor;
