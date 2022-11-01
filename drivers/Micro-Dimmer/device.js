'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class MicroDimmer extends ZwaveDevice {

  async onNodeInit() {
    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    this.registerCapability('onoff', 'SWITCH_MULTILEVEL');
    this.registerCapability('dim', 'SWITCH_MULTILEVEL');
  }

}

module.exports = MicroDimmer;
