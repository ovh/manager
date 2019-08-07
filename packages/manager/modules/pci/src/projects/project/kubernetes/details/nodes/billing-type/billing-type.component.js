import controller from './billing-type.controller';
import template from './billing-type.html';

const component = {
  bindings: {
    goBack: '<',
    instanceId: '<',
    kubeId: '<',
    nodeId: '<',
    nodeName: '<',
    projectId: '<',
  },
  controller,
  template,
};

export default component;
