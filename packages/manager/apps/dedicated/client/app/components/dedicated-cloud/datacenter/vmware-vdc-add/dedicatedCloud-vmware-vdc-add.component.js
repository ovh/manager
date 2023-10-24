import controller from './dedicatedCloud-vmware-vdc-add.controller';
import template from './dedicatedCloud-vmware-vdc-add.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    trackClick: '<',
  },
  controller,
  template,
};
