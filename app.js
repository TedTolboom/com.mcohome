'use strict';

const Homey = require('homey');

class MCOhomeApp extends Homey.App {

	onInit() {

		this.log('MCOhomeApp is running...');

		// Register actions for flows
		this.actionStartDimLevelChange = new Homey.FlowCardAction('action_DIM_startLevelChange')
			.register()
			.registerRunListener(this._actionStartDimLevelChangeRunListener.bind(this));
		// Register actions for flows
		this.actionStopDimLevelChange = new Homey.FlowCardAction('action_DIM_stopLevelChange')
			.register()
			.registerRunListener(this._actionStopDimLevelChangeRunListener.bind(this));

	}

	async _actionStartDimLevelChangeRunListener(args, state) {
		if (!args.hasOwnProperty('direction')) return Promise.reject('direction_property_missing');
		// if (!args.hasOwnProperty('duration')) return Promise.reject('duration_property_missing');
		this.log('FlowCardAction triggered for ', args.device.getName(), 'to start dim level change in direction', args.direction);

		const nodeCommandClassVersion = parseInt(args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.version);
		this.log('Multilevel command class', nodeCommandClassVersion, nodeCommandClassVersion <= 2);
		//if (nodeCommandClassVersion <= 2) {
		//	this.log('Setting the object');
		let startLevelChangeObj = {
			/* Properties1 object currently not parsed correctly.
			'Properties1': {
				'Reserved1': 0, 					// This field MUST be set to 0 by a sending node and MUST be ignored by a receiving node.
				'Ignore Start Level': 1, 	// V2 0 (respect start level), 1 (ignore start level)
				'Up/ Down': 1, 						// V2 0 (level increasing), 1 (level decreasing)
				'Reserved2': 0, 					// This field MUST be set to 0 by a sending node
			},
			*/
			'Properties1': new Buffer([args.direction === '1' ? (nodeCommandClassVersion > 2 ? 0x68 : 0x60) : 0x20]), // direction based, always ignoring start level
			'Start Level': 0, // 8-bit (0x00 - 0xFF)
			'Dimming Duration': args.duration / 1000 || 255, // if no duration has been set, use factory default (255),
			'Step Size': 1,
		}
		//	}
		//	else {
		//		let startLevelChangeObj = {

		/* Properties1 object currently not parsed correctly.
		'Properties1': {
			'Reserved': 0, 						// This field MUST be set to 0 by a sending node and MUST be ignored by a receiving node.
			'Inc Dec': 0, 						// args.direction === '1' ? 'Increment' : 'Decrement', // args.direction === '1' ? 'Increment' : 'Decrement', // 'Increment', 'Decrement', 'Reserved', 'None'
			'Ignore Start Level': 1, 	// V2 0 (respect start level), 1 (ignore start level)
			'Up/ Down': 0, 						// args.direction === '1' ? 'Up' : 'Down', // V3 'Up', 'Down', 'Reserved', 'None'
			'Reserved2': 0, // This field MUST be set to 0 by a sending node
		},
		*/
		//			'Properties1': new Buffer([args.direction === '1' ? 0x68 : 0x20]),
		//			'Start Level': 0, // 8-bit (0x00 - 0xFF)
		//			'Dimming Duration': args.duration / 1000 || 255, // V2 'Instantly' (0x00), 'Factory default' (0xFF)?
		//			'Step Size': 1,
		//		}
		//	};
		this.log('startLevelChangeObj', startLevelChangeObj);
		args.device.log('startLevelChangeObj', startLevelChangeObj, 'JSON.stringified:', JSON.stringify(startLevelChangeObj))

		// Manual 33,0x26,0x04,0x00,0x00,0x01,0xFF,0x02,0x00
		if (args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL) {
			return await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_START_LEVEL_CHANGE(startLevelChangeObj);
		}
		return Promise.reject('unknown_error');
	}

	async _actionStopDimLevelChangeRunListener(args, state) {
		//if (!args.hasOwnProperty('direction')) return Promise.reject('direction_property_missing');
		this.log('FlowCardAction triggered for ', args.device.getName(), 'to stop dim level change');

		if (args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL) {
			return await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE({});
		}
		return Promise.reject('unknown_error');
	}

}

module.exports = MCOhomeApp;