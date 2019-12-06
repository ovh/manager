import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    availableFlavors: '<',
    goBack: '<',
    goToProjectQuota: '<',
    kubeId: '<',
    prices: '<',
    projectId: '<',
    quotas: '<',
  },
  template,
  controller,
};

export default component;
