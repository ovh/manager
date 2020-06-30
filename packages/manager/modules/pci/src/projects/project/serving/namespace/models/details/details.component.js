import controller from './details.controller';
import template from './details.html';
import './details.scss';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    namespace: '<',
    goToContainer: '<',
    projectId: '<',
    model: '<',
    metricsToken: '<',
  },
  template,
  controller,
};
