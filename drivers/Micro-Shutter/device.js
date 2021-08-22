'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class MicroShutter extends ZwaveDevice {

  onMeshInit() {
    // based on FGRM-222
    // enable debugging
    this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    this.registerCapability('windowcoverings_state', 'SWITCH_BINARY', {
      get: 'SWITCH_BINARY_GET',
      set: 'SWITCH_BINARY_SET',
      setParser: value => {
        const invert  = false;
        if (node.hasOwnProperty('settings') && node.settings.hasOwnProperty('invertWindowCoveringsDirection')) {
          invert  = node.settings.invertWindowCoveringsDirection;
        }

        let result = 0;
        const offset = 0;  // offset not necesary
        const state = this.getCapabilityValue('windowcoverings_state');
        console.log('windowcoverings_state value', value);
        console.log('windowcoverings_state state', state);

        // Check correct counter value in case of idle
        // Not the ideal implementation as the shutter does not stop the operation upon an opposite command unlike FIBARO
        // An anticipated offset is being used until a better solution is found
        const currentLevel = parseInt(this.getCapabilityValue('windowcoverings_set') * 100);
        console.log('1 windowcoverings_set currentLevel', currentLevel);
        if (state === 'idle') {
          result = null;
          if (state === 'up') {
            result = currentLevel + offset;
            if (result > 99) {
              result = 99;
            }
          } else if (state === 'down') {
            result = currentLevel - offset;
            if (result < 1) {
              result = 1;
            }
          } else result = currentLevel;
        }

        if (value === 'up') {
          if (invert) result = 0;
          else result = 99;
        }

        if (value === 'down') {
          if (invert) result = 99;
          else result = 0;
        }

        return {
          Value: result,
        };
      },
      report: 'SWITCH_BINARY_REPORT',
      // reportParser(report) {
      //   console.log('report ' , report);
      //   if (invert) {
      //     this.setCapabilityValue('windowcoverings_state', (100 - report['Value (Raw)'][0]) / 99);
      //   } else {
      //     this.setCapabilityValue('windowcoverings_state', report['Value'] / 99);
      //   }
      //   return null;
      // },
    });
    this.registerCapability('windowcoverings_set', 'SWITCH_MULTILEVEL', {
      get: 'SWITCH_MULTILEVEL_GET',
      set: 'SWITCH_MULTILEVEL_SET',
      setParser: this._dimSetParser.bind(this),
      report: 'SWITCH_MULTILEVEL_REPORT',
      reportParser:  this._dimReportParser.bind(this),
      reportParserOverride: true,
    });

    // "measure_power" as very inacurate and inpredictable
    // this.registerCapability('measure_power', 'METER');

    this.registerSetting('start_calibration', newValue => {
      console.log('start_calibration', newValue );

      if (newValue) {
        setTimeout(() => {
          console.log('setTimeout start_calibration', newValue );

          this.setSettings({ start_calibration: false });
        }, 30000);
      }
      return new Buffer.from([newValue ? 1 : 0]);
    });
  }

  _dimSetParser(value) {
    console.log('_dimSetParser ', value);

    let invert;
    typeof this.getSetting('invertWindowCoveringsDirection') === 'boolean' ? invert = this.getSetting('invertWindowCoveringsDirection') : false;

    if (value > 1) {
      if (invert) value = 0;
      else value = 1;
    }

    if (invert) value = (1 - value.toFixed(2)) * 99;
    else value *= 99;

    return {
      Value: value,
      'Dimming Duration': 'Factory default',
    };
  }

  _dimReportParser(report) {
    console.log('_dimReportParser ', report);
    let invert;
    typeof this.getSetting('invertWindowCoveringsDirection') === 'boolean' ? invert = this.getSetting('invertWindowCoveringsDirection') : false;

    if (typeof report['Value (Raw)'] === 'undefined') return null;
    if (invert) return (100 - report['Value (Raw)'][0]) / 100;
    return report['Value (Raw)'][0] / 100;
  }
}

module.exports = MicroShutter;
