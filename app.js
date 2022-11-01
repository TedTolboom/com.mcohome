'use strict';

const Homey = require('homey');

class MCOhomeApp extends Homey.App {

  async onInit() {
    this.log('MCOhomeApp is running...');

    this.actionStartDimLevelChange = this.homey.flow.getActionCard('action_DIM_startLevelChange')
      // .register()
      .registerRunListener(this._actionStartDimLevelChangeRunListener.bind(this));

    this.actionStopDimLevelChange = this.homey.flow.getActionCard('action_DIM_stopLevelChange')
      // .register()
      .registerRunListener(this._actionStopDimLevelChangeRunListener.bind(this));

    // thermostat_onoff trigger cards
    this.triggerThermostatOnoffTrue = this.homey.flow.getDeviceTriggerCard('thermostat_onoff_true'); // .register();
    this.triggerThermostatOnoffFalse = this.homey.flow.getDeviceTriggerCard('thermostat_onoff_false'); //.register();

    // Register conditions for flows
    this.triggerThermostatOnoffOn = this.homey.flow.getConditionCard('thermostat_onoff_on')
      // .register()
      .registerRunListener((args, state) => {
        return args.device.getCapabilityValue('thermostat_onoff');
      });
  }

  async _actionStartDimLevelChangeRunListener(args, state) {
    if (!args.hasOwnProperty('direction')) return Promise.reject(new Error('direction_property_missing'));
    args.device.log('getActionCard triggered to start dim level change in direction', args.direction);

    const nodeCommandClassVersion = parseInt(args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.version);

    const startLevelChangeObj = {
      Properties1: Buffer.from([args.direction === '1' ? (nodeCommandClassVersion > 2 ? 0x68 : 0x60) : 0x20]), // direction based, always ignoring start level
      'Start Level': 0,
      'Dimming Duration': args.duration / 1000 || 255, // if no duration has been set, use factory default (255),
      'Step Size': 1,
    };

    if (args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL) {
      return await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_START_LEVEL_CHANGE(startLevelChangeObj);
    }
    return Promise.reject(new Error('unknown_error'));
  }

  async _actionStopDimLevelChangeRunListener(args, state) {
    args.device.log('getActionCard triggered for ', args.device.getName(), 'to stop dim level change');

    if (args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL) {
      return await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE({});
    }
    return Promise.reject(new Error('unknown_error'));
  }

}

module.exports = MCOhomeApp;
