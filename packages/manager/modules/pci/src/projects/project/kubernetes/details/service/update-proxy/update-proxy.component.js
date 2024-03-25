import controller from './update-proxy.controller';
import template from './update-proxy.template.html';

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
