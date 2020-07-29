import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    cancelLink: '<',
    goBack: '<',
    goToProjectQuota: '<',
    kubeId: '<',
    flavor: '<',
    maxInstances: '<',
    nodeCount: '<',
    nodePoolName: '<',
    nodePoolId: '<',
    projectId: '<',
    quotas: '<',
  },
  controller,
  template,
};

export default component;
