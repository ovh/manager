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
    sendKubeTrack: '<',
  },
  controller,
  template,
};

export default component;
