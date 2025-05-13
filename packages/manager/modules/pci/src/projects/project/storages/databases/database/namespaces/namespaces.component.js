import controller from './namespaces.controller';
import template from './namespaces.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDashboard: '<',
    namespacesList: '<',
    refreshNamespaces: '<',
    goToAddNamespace: '<',
    goToEditNamespace: '<',
    goToDeleteNamespace: '<',
  },
  controller,
  template,
};
