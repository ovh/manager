import controller from './ssh-keys.controller';
import template from './ssh-keys.html';

export default {
  controller,
  template,
  bindings: {
    region: '<',
    selectedKey: '=',
    serviceName: '@',
  },
};
