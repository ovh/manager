import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    publicIPs: '<',
    privateIPs: '<',
    displayAlerterMessage: '<',
    deleteModalLink: '<',
  },
  controller,
  template,
};
