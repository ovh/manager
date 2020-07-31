import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    goBack: '<',
    kubeId: '<',
    nodeId: '<',
    nodeName: '<',
    projectId: '<',
  },
  controller,
  template,
};

export default component;
