'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class CO2monitor extends ZwaveDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// register device capabilities
		this.registerCapability('measure_co2', 'SENSOR_MULTILEVEL', {
			getOpts: {
				getOnStart: true, // get the initial value on app start
				//pollInterval: 'poll_interval' // maps to device settings
			}
		});
		// register device capabilities
		this.registerCapability('alarm_co2', 'NOTIFICATION', {
			getOpts: {
				getOnStart: true, // get the initial value on app start
				//pollInterval: 'poll_interval' // maps to device settings
			}
		});
		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL', {
			getOpts: {
				getOnStart: true, // get the initial value on app start
				//pollInterval: 'poll_interval' // maps to device settings
			}
		});
		this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL', {
			getOpts: {
				getOnStart: true, // get the initial value on app start
				//pollInterval: 'poll_interval' // maps to device settings
			}
		});
	}

}

module.exports = CO2monitor;
