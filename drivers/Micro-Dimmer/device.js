'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class MicroDimmer extends ZwaveDevice {
	onMeshInit() {

		// enable debugging
		// this.enableDebug();

		// print the node's info to the console
		// this.printNode();

		this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
		this.registerCapability('dim', 'SWITCH_MULTILEVEL');
	}
}

/*
startDimLevelParserV2(value) {
	return {
		'Properties1': {
		'Reserved1': 0,						// This field MUST be set to 0 by a sending node and MUST be ignored by a receiving node.
		'Ignore Start Level': 0, 	// V2 0 (respect start level), 1 (ignore start level)
		'Up/ Down': value, 				// V2 0 (level increasing), 1 (level decreasing)
		'Reserved2': 0,
	},
	 'Start Level' : ,					// 8-bit (0x00 - 0xFF)
	 'Dimming Duration': 'Factory default',			// V2 'Instantly' (0x00), 'Factory default' (0xFF)?
	 'Step Size': 0, 						// V4
	}
}

startDimLevelParserV3(value) {
	return {
		'Properties1': {
		'Reserved': 0,						// This field MUST be set to 0 by a sending node and MUST be ignored by a receiving node.
		'Inc Dec': 'None',				// V3+: Secundary switch: 'Increment', 'Decrement', 'Reserved', 'None'
		'Ignore Start Level': 0, 	// V2+ 0 (respect start level), 1 (ignore start level)
		'Up/ Down': value, 				// V3+: Primary switch: 'Up', 'Down', 'Reserved', 'None'
	},
	 'Start Level' : 0,					// 8-bit (0x00 - 0xFF)
	 'Dimming Duration': 'Default',	// V4 'Instantly' (0x00), 'Default' (0xFF)?
	 'Step Size': 0,						// V4
	}
}
stopDimLevelParser () {
	return {}
}
*/

module.exports = MicroDimmer;