'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class TouchPanelDimmerPlus extends ZwaveDevice {
	onMeshInit() {

		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		// register capabilities for this device
		this.registerCapability('onoff', 'BASIC', {
			get: 'BASIC_GET',
			set: 'BASIC_SET',
			report: 'BASIC_REPORT',
			reportParser(report) {

				if (report['Value'] > 0) {
					this.setCapabilityValue('onoff', true);
				}
				else {
					this.setCapabilityValue('onoff', false);
				}
				this.setCapabilityValue('dim', report['Value'] / 100);
				return null;
			}
		});

		this.registerCapability('dim', 'SWITCH_MULTILEVEL');
	}
}

module.exports = TouchPanelDimmerPlus;
