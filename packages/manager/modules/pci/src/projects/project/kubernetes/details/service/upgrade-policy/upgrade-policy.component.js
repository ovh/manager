import controller from './upgrade-policy.controller';
import template from './upgrade-policy.html';

const component = {
  bindings: {
    cluster: '<',
    kubeId: '<',
    goBack: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
