import controller from './terminate.controller';
import template from './terminate.html';

const component = {
  bindings: {
    cluster: '<',
    kubeId: '<',
    goBack: '<',
    isLegacyCluster: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
