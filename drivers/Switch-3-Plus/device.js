'use strict';

const { ZwaveDevice } = require('homey-meshdriver');

class TouchPanelSwitch3Plus extends ZwaveDevice {

  onMeshInit() {
    // enable debugging
    // this.enableDebug();

    // print the node's info to the console
    // this.printNode();

    // register capabilities for this device
    this.registerCapability('onoff', 'BASIC');
  }

}

module.exports = TouchPanelSwitch3Plus;
