import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    goBack: '<',
    kubeId: '<',
    nodePoolId: '<',
    nodePoolName: '<',
    projectId: '<',
  },
  controller,
  template,
};

export default component;
