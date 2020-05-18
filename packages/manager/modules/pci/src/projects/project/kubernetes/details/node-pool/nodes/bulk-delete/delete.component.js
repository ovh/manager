import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    goBack: '<',
    kubeId: '<',
    nodePoolId: '<',
    nodeCount: '<',
    projectId: '<',
  },
  controller,
  template,
};

export default component;
