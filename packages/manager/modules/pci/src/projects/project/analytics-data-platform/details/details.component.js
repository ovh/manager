import controller from './details.controller';
import template from './details.html';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    platformDetails: '<',
    serviceName: '<',
  },
};
