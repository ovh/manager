import template from './cluster.html';

export default {
  bindings: {
    cluster: '<',
    serviceInfos: '<',
    displayName: '<',
    currentActiveLink: '<',
    dashboardLink: '<',
    nodesLink: '<',
  },
  template,
};
