import template from './dedicated-server.html';

export default {
  bindings: {
    featureAvailability: '<',
    isMultiAZAvailable: '<',
    currentActiveLink: '<',
    clustersLink: '<',
    allServersLink: '<',
  },
  template,
};
