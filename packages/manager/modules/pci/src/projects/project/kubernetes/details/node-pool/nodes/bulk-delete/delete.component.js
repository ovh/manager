import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    goBack: '<',
    kubeId: '<',
    nodePoolId: '<',
    nodeCount: '<',
    projectId: '<',
    sendKubeTrack: '<',
  },
  controller,
  template,
};

export default component;
