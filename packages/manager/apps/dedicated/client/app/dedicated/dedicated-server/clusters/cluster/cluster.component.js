import template from './cluster.html';
import controller from './cluster.controller';

export default {
  bindings: {
    cluster: '<',
    serviceInfos: '<',
    displayName: '<',
    currentActiveLink: '<',
    dashboardLink: '<',
    nodesLink: '<',
    guidesLinkOf3AZ: '<',
  },
  template,
  controller,
};
