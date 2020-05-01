'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ShutterPanel extends ZwaveDevice {
	onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		this.registerCapability('windowcoverings_state', 'BASIC', {
			get: 'BASIC_GET',
			set: 'BASIC_SET',
			setParser: value => {

				let invertDirection = false;
				// if (node.hasOwnProperty('settings') && node.settings.hasOwnProperty('invert_direction')) {
				// 	invertDirection = node.settings.invert_direction;
				// }

				let result = 0;
				let offset = 8;
				let state = this.getCapabilityValue('windowcoverings_state');
				console.log(value);
				console.log(state);

				// Check correct counter value in case of idle
				// Not the ideal implementation as the shutter does not stop the operation upon an opposite command unlike FIBARO
				// An anticipated offset is being used until a better solution is found
				if (value === 'idle') {
					result = null;
					let currentLevel = parseInt(this.getCapabilityValue('dim') * 100);
					console.log(currentLevel);
					if (state === 'up') {
						result = currentLevel + offset;
						if (result > 99)
							result = 99;
					}
					else if (state === 'down') {
						result = currentLevel - offset;
						if (result < 1)
							result = 1;
					}
					else result = currentLevel;
				}

				if (value === 'up') {
					if (invertDirection) result = 0;
					else result = 255;
				}

				if (value === 'down') {
					if (invertDirection) result = 255;
					else result = 0;
				}

				return {
					'Value': result,
				};
			},
			report: 'BASIC_REPORT',
			reportParser(report) {
				console.log(report);
				return null;
			}
		});
		this.registerCapability('dim', 'SWITCH_MULTILEVEL');
	}
}

module.exports = ShutterPanel;