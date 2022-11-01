'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-zwavedriver');

class A89Sensor extends ZwaveDevice {

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
    this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
    });
    this.registerCapability('measure_noise', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
    });
    this.registerCapability('alarm_motion', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
      report: 'SENSOR_MULTILEVEL_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)')) {
          if (report['Sensor Value (Parsed)'] === 1 && report['Sensor Type'] === 'General purpose value (version 1)') return true;
          if (report['Sensor Value (Parsed)'] === 0 && report['Sensor Type'] === 'General purpose value (version 1)') return false;

          return null;
        }
      },
    });
    this.registerCapability('alarm_smoke', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
      report: 'SENSOR_MULTILEVEL_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)')) {
          if (report['Sensor Value (Parsed)'] === 100 && report['Sensor Type'] === 'Smoke Density (v8)') return true;
          if (report['Sensor Value (Parsed)'] === 0 && report['Sensor Type'] === 'Smoke Density (v8)') return false;

          return null;
        }
      },
    });
    this.registerCapability('measure_voc', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
      report: 'SENSOR_MULTILEVEL_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Sensor Type') && report.hasOwnProperty('Sensor Value (Parsed)')) {
          if (report['Sensor Type'] === 'Volatile Organic Compound (v7)') {
            const parsedRAW = report['Sensor Value (Parsed)'];
            const parsedVOC = Math.round(parsedRAW * 1000);
            this.setCapabilityValue('alarm_voc', parsedVOC >= (this.getSetting('voc_notification') || 2200)).catch(this.error);
            this.setCapabilityValue('measure_voc', parsedVOC).catch(this.error);
          }
        }
        return null;
      },
    });

    this.registerCapability('measure_pm25', 'SENSOR_MULTILEVEL', {
      getOpts: {
        		getOnStart: true, // get the initial value on app start
        // pollInterval: 'poll_interval' // maps to device settings
      },
      // << containment for error in report handling of Particulate Matter 2.5 (v7)
      report: 'SENSOR_MULTILEVEL_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Sensor Value (Parsed)')) {
          if (report.hasOwnProperty('Sensor Type')) {
            console.log('Sensor Type: ', report['Sensor Type']); // debugging only
            if (report['Sensor Type'] === 'Particulate Matter 2.5 (v7)') {
              this.setCapabilityValue('alarm_pm25', report['Sensor Value (Parsed)'] >= (this.getSetting('PM2.5_notification') || 150)).catch(this.error);
              return report['Sensor Value (Parsed)'];
            }
          }
        }
        return null;
      },
    });
  }

}

module.exports = A89Sensor;
