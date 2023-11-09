'use strict';

const Homey = require('homey');
const { ZwaveDevice } = require('homey-meshdriver');

const MasterData = {
  Off: {
    Mode: 'Off',
    Setpoint: 'not supported',
  },
  Heat: {
    Mode: 'Heat',
    Setpoint: 'Heating 1',
  },
  Cool: {
    Mode: 'Cool',
    Setpoint: 'Cooling 1',
  },
  'Fan Only': {
    Mode: 'Fan Only',
    Setpoint: 'not supported',
  },
};

// Create mapMode2Setpoint array based on MasterData array
const mapMode2Setpoint = {};
for (const mode in MasterData) {
  mapMode2Setpoint[MasterData[mode].Mode] = MasterData[mode].Setpoint;
}

class Thermostat_MH52D extends ZwaveDevice {

  onMeshInit() {
    // enable debugging
    this.enableDebug();

    // print the node's info to the console
    this.printNode();

    // registerCapability for measure_temperature for FW <=18.
    this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL', {
      getOpts: {
        getOnStart: true,
        pollInterval: 'poll_interval_TEMPERATURE',
        pollMultiplication: 60000,
      },
    });

    this.registerCapability('thermostat_mode_MH52D', 'THERMOSTAT_MODE', {
      getOpts: {
        getOnStart: true,
        // pollInterval: 'poll_interval_THERMOSTAT_MODE',
        // pollMultiplication: 60000,
      },
      get: 'THERMOSTAT_MODE_GET',
      set: 'THERMOSTAT_MODE_SET',
      setParserV2: thermostatMode => {
        this.log('Setting thermostat mode to:', thermostatMode);

        // 1. Update thermostat setpoint based on matching thermostat mode
        const setpointType = mapMode2Setpoint[thermostatMode];

        if (setpointType !== 'not supported') {
          this.setCapabilityValue('target_temperature', this.getStoreValue(`thermostatsetpointValue.${setpointType}`) || null);
        } else {
          this.setCapabilityValue('target_temperature', null);
        }

        // 3. Trigger mode trigger cards if the mode is actually changed
        if (this.getCapabilityValue('thermostat_mode_MH52D') !== thermostatMode) {
          const thermostatModeObj = {
            mode: thermostatMode,
            mode_name: Homey.__(`mode.${thermostatMode}`),
          };
          this.triggerThermostatModeChanged.trigger(this, thermostatModeObj, null);
          this.triggerThermostatModeChangedTo.trigger(this, null, thermostatModeObj);
        }
        // 5. Return setParser object and update thermostat_mode_MH52D capability
        return {
          Level: {
            'No of Manufacturer Data fields': 0,
            Mode: thermostatMode,
          },
          'Manufacturer Data': Buffer.from([0]),
        };
      },
      report: 'THERMOSTAT_MODE_REPORT',
      reportParserV2: report => {
        if (!report) return null;
        if (report.hasOwnProperty('Level') && report.Level.hasOwnProperty('Mode')) {
          const thermostatMode = report.Level.Mode;
          this.log('Received thermostat mode report:', thermostatMode);

          // 1. Update thermostat setpoint value based on matching thermostat mode
          const setpointType = mapMode2Setpoint[thermostatMode];

          if (setpointType !== 'not supported') {
            this.setCapabilityValue('target_temperature', this.getStoreValue(`thermostatsetpointValue.${setpointType}`) || null);
          } else {
            this.setCapabilityValue('target_temperature', null);
          }

          // 3. Trigger mode trigger cards if the mode is actually changed
          if (this.getCapabilityValue('thermostat_mode_MH52D') !== thermostatMode) {
            const thermostatModeObj = {
              mode: thermostatMode,
              mode_name: Homey.__(`mode.${thermostatMode}`),
            };
            this.triggerThermostatModeChanged.trigger(this, thermostatModeObj, null);
            this.triggerThermostatModeChangedTo.trigger(this, null, thermostatModeObj);
          }

          // 5. Return reportParser object and update thermostat_mode_MH52D capability
          return thermostatMode;
        }
        return null;
      },
    });

    this.registerCapability('target_temperature', 'THERMOSTAT_SETPOINT', {
      getOpts: {
        getOnStart: true,
        // pollInterval: 'poll_interval_THERMOSTAT_SETPOINT',
        // pollMultiplication: 60000,
      },
      getParser: () => {
        // 1. Retrieve the setpointType based on the thermostat mode
        const setpointType = mapMode2Setpoint[this.getCapabilityValue('thermostat_mode_MH52D') || 'Heat'];

        // 2. Return getParser object with correct setpointType
        return {
          Level: {
            'Setpoint Type': setpointType !== 'not supported' ? setpointType : 'Heating 1',
          },
        };
      },
      set: 'THERMOSTAT_SETPOINT_SET',
      setParser(setpointValue) {
        // 1. Retrieve the setpointType based on the thermostat mode
        const setpointType = mapMode2Setpoint[this.getCapabilityValue('thermostat_mode_MH52D') || 'Heat'];

        this.log('Setting thermostat setpoint to:', setpointValue, 'for setpointType', setpointType);

        if (setpointType !== 'not supported') {
          // 2. Store thermostat setpoint based on thermostat type
          this.setStoreValue(`thermostatsetpointValue.${setpointType}`, setpointValue);

          // 4. Return setParser object and update thermostat mode
          const bufferValue = Buffer.alloc(2);
          bufferValue.writeUInt16BE((Math.round(setpointValue * 2) / 2 * 10).toFixed(0));

          return {
            Level: {
              'Setpoint Type': setpointType,
            },
            Level2: {
              Size: 2,
              Scale: 0,
              Precision: 1,
            },
            Value: bufferValue,
          };
        }

        setTimeout(() => {
          this.setCapabilityValue('target_temperature', null);
        }, 500);


        return null;
      },
      report: 'THERMOSTAT_SETPOINT_REPORT',
      reportParser: report => {
        if (report && report.hasOwnProperty('Level2')
          && report.Level2.hasOwnProperty('Scale')
          && report.Level2.hasOwnProperty('Precision')
          && report.Level2.Scale === 0
          && typeof report.Level2.Size !== 'undefined') {
          // 1. Try to read the readValue
          let readValue;
          try {
            readValue = report.Value.readUIntBE(0, report.Level2.Size);
          } catch (err) {
            return null;
          }

          if (typeof readValue !== 'undefined') {
            // 2. Define the setPointValue and setpointType
            const setpointValue = readValue / Math.pow(10, report.Level2.Precision);
            const setpointType = report.Level['Setpoint Type'];
            this.log('Received thermostat setpoint report: Setpoint type', setpointType, ' Setpoint value', setpointValue);

            // 3. Store thermostat setpoint based on thermostat type
            if (setpointType !== 'not supported') {
              this.setStoreValue(`thermostatsetpointValue.${setpointType}`, setpointValue);
            }

            // 5. Update UI if reported setpointType equals active sepointType based on the thermostat mode
            if (setpointType === mapMode2Setpoint[this.getCapabilityValue('thermostat_mode_MH52D') || 'Heat']) {
              this.log('Updated thermostat setpoint on UI to', setpointValue);
              return setpointValue;
            }

            return null;
          }
          return null;
        }
        return null;
      },
    });


    this.registerCapability('fan_mode_MH52D', 'THERMOSTAT_FAN_MODE', {
      getOpts: {
        getOnStart: true,
      },
      get: 'THERMOSTAT_FAN_MODE_GET',
      set: 'THERMOSTAT_FAN_MODE_SET',
      setParserV2: fanMode => {
        this.log('Setting fan mode to:', fanMode);

        if (this.getCapabilityValue('fan_mode_MH52D') !== fanMode) {
          const fanModeObj = {
            mode: fanMode,
            mode_name: Homey.__(`mode.${fanMode}`),
          };
          this.triggerFanModeChangedTo.trigger(this, null, fanModeObj);
        }
        return {
          Properties1: {
            Off: false,
            'Fan Mode': fanMode,
          },
          'Manufacturer Data': Buffer.from([0]),
        };
      },
      report: 'THERMOSTAT_FAN_MODE_REPORT',
      reportParserV2: report => {
        if (!report) return null;
        if (report.hasOwnProperty('Properties1') && report.Properties1.hasOwnProperty('Fan Mode')) {
          const fanMode = report.Properties1["Fan Mode"];
          this.log('Received fan mode report:', fanMode);

          if (this.getCapabilityValue('fan_mode_MH52D') !== fanMode) {
            const fanModeObj = {
              mode: fanMode,
              mode_name: Homey.__(`mode.${fanMode}`),
            };
            this.triggerFanModeChangedTo.trigger(this, null, fanModeObj);
          }

          return fanMode;
        }
        return null;
      },
    });

    // thermostat_mode_MH52D_changed
    this.triggerThermostatModeChanged = new Homey.FlowCardTriggerDevice('thermostat_mode_changed');
    this.triggerThermostatModeChanged
      .register();

    // thermostat_mode_MH52D_changed_to
    this.triggerThermostatModeChangedTo = new Homey.FlowCardTriggerDevice('thermostat_mode_MH52D_changed_to');
    this.triggerThermostatModeChangedTo
      .register()
      .registerRunListener((args, state) => Promise.resolve(args.mode === state.mode));

    // fan_mode_MH52D_changed_to
    this.triggerFanModeChangedTo = new Homey.FlowCardTriggerDevice('fan_mode_MH52D_changed_to');
    this.triggerFanModeChangedTo
      .register()
      .registerRunListener((args, state) => Promise.resolve(args.mode === state.mode));

    // Register actions for flows thermostat_change_mode
    this._actionThermostatChangeMode = new Homey.FlowCardAction('change_thermostat_mode_MH52D')
      .register()
      .registerRunListener((args, state) => {
        const thermostatMode = args.mode;
        this.log('FlowCardAction triggered for ', args.device.getName(), 'to change Thermostat mode to', thermostatMode);

        // Trigger the thermostat mode setParser
        return args.device.triggerCapabilityListener('thermostat_mode_MH52D', thermostatMode, {});
      });

    // Register actions for flows
    this._actionThermostatChangeSetpoint = new Homey.FlowCardAction('change_thermostat_mode_MH52D_setpoint')
      .register()
      .registerRunListener(this._actionThermostatChangeSetpointRunListener.bind(this));

    // Register actions for flows thermostat_change_mode
    this._actionFanChangeMode = new Homey.FlowCardAction('change_fan_mode_MH52D')
      .register()
      .registerRunListener((args, state) => {
        const fanMode = args.mode;
        this.log('FlowCardAction triggered for ', args.device.getName(), 'to change Fan mode to', fanMode);

        // Trigger the thermostat mode setParser
        return args.device.triggerCapabilityListener('fan_mode_MH52D', fanMode, {});
      });

    this.log('MH52D device driver MeshInit completed');
  }

  // thermostat_change_mode_setpoint

  async _actionThermostatChangeSetpointRunListener(args, state) {
    if (!args.hasOwnProperty('setpointMode')) return Promise.reject(new Error('setpointMode_property_missing'));
    if (!args.hasOwnProperty('setpointValue')) return Promise.reject(new Error('setpointValue_property_missing'));
    if (typeof args.setpointValue !== 'number') return Promise.reject(new Error('setpointValue_is_not_a_number'));

    // 1. Retrieve the setpointType based on the thermostat mode
    const setpointType = mapMode2Setpoint[args.setpointMode];
    const { setpointValue } = args;
    this.log('FlowCardAction triggered for ', args.device.getName(), 'to change setpoint value', setpointValue, 'for', setpointType);

    // 2. Store thermostat setpoint based on thermostat type
    this.setStoreValue(`thermostatsetpointValue.${setpointType}`, setpointValue);

    // 5. Update UI if reported setpointType equals active sepointType based on the thermostat mode
    if (setpointType === mapMode2Setpoint[this.getCapabilityValue('thermostat_mode_MH52D') || 'Heat']) {
      this.log('Updated thermostat setpoint on UI to', setpointValue);
      this.setCapabilityValue('target_temperature', setpointValue);
    }

    // 6. Trigger command to update device setpoint
    const bufferValue = Buffer.alloc(2);
    bufferValue.writeUInt16BE((Math.round(setpointValue * 2) / 2 * 10).toFixed(0));

    if (args.device.node.CommandClass.COMMAND_CLASS_THERMOSTAT_SETPOINT) {
      return args.device.node.CommandClass.COMMAND_CLASS_THERMOSTAT_SETPOINT.THERMOSTAT_SETPOINT_SET({
        Level: {
          'Setpoint Type': setpointType,
        },
        Level2: {
          Size: 2,
          Scale: 0,
          Precision: 1,
        },
        Value: bufferValue,
      });
    }
    return Promise.reject(new Error('unknown_error'));
  }

}

module.exports = Thermostat_MH52D;
