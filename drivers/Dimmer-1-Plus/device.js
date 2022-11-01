'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class TouchPanelDimmerPlus extends ZwaveDevice {

  async onNodeInit() {
    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    // register capabilities for this device
    this.registerCapability('onoff', 'BASIC', {
      get: 'BASIC_GET',
      set: 'BASIC_SET',
      report: 'BASIC_REPORT',
      reportParser(report) {
        if (report['Value'] > 0) {
          this.setCapabilityValue('onoff', true).catch(this.error);
        } else {
          this.setCapabilityValue('onoff', false).catch(this.error);
        }
        this.setCapabilityValue('dim', report['Value'] / 100).catch(this.error);
        return null;
      },
    });

    this.registerCapability('dim', 'SWITCH_MULTILEVEL');
  }

}

module.exports = TouchPanelDimmerPlus;
