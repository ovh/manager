import controller from './edit-name.controller';
import template from './edit-name.html';

const component = {
  bindings: {
    cluster: '<',
    kubeConfig: '<',
    kubeId: '<',
    goBack: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
