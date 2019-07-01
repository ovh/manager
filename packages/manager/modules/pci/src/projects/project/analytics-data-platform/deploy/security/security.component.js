import controller from './security.controller';
import template from './security.html';

export default {
  template,
  controller,
  bindings: {
    vRack: '<',
    publicCloud: '<',
    sshKeys: '<',
    selectedCapability: '<',
    onDataChange: '&',
  },
};
