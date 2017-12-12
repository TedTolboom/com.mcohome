'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class Thermostat_MH7EH extends ZwaveDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// register device capabilities
		// this.registerCapability('measure_co2', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL', {
			getOpts: {
				getOnStart: true, // get the initial value on app start
				//pollInterval: 'poll_interval' // maps to device settings
			}
		});
		// this.registerCapability('target_temperature', 'THERMOSTAT_ENDPOINT');
	}

}

module.exports = Thermostat_MH7EH;
