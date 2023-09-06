import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    resourceId: '<',
    currentActiveLink: '<',
    dashboardLink: '<',
    subnetLink: '<',
    endpointsLink: '<',
    resource: '<',
    vrackLink: '<',
  },
  controller,
  template,
};
