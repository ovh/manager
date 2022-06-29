import controller from './terminate.controller';
import template from './terminate.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    ip: '<',
    onCancelClick: '<',
    serviceName: '<',
    terminateIp: '<',
  },
};
