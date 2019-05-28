import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    goBack: '<',
    kubeId: '<',
    nodeId: '<',
    projectId: '<',
  },
  template,
  controller,
};

export default component;
