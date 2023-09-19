import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    trafficInformations: '<',
    dedicatedServer: '<',
    currentActiveLink: '<',
  },
  controller,
  template,
};
