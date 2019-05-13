import controller from './update.controller';
import template from './update.html';

const component = {
  bindings: {
    kubeId: '<',
    goBack: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
