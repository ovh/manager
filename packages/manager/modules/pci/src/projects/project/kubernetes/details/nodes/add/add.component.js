import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    flavors: '<',
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
