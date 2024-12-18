import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    status: '<',
    serviceStatus: '<',
    powerState: '<',
    os: '<',
  },
  template,
  controller,
};
