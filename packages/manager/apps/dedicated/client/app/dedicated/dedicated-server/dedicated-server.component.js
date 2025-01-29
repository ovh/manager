import template from './dedicated-server.html';
import controller from './dedicated-server.controller';

export default {
  bindings: {
    featureAvailability: '<',
    isMultiAZAvailable: '<',
    currentActiveLink: '<',
    clustersLink: '<',
    allServersLink: '<',
  },
  template,
  controller,
};
