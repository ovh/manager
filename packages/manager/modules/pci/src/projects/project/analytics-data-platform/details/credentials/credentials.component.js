import controller from './credentials.controller';
import template from './credentials.html';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    serviceName: '<',
    platformDetails: '<',
  },
};
