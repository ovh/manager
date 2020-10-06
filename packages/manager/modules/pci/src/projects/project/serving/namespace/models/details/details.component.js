import controller from './details.controller';
import template from './details.html';
import './details.scss';

export default {
  bindings: {
    goBack: '<',
    namespaceId: '<',
    namespace: '<',
    deleteModel: '<',
    updateModel: '<',
    goToContainer: '<',
    projectId: '<',
    model: '<',
    metricsToken: '<',
  },
  template,
  controller,
};
