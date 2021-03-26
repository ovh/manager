import controller from './reset-kubeconfig.controller';
import template from './reset-kubeconfig.html';

const component = {
  bindings: {
    cluster: '<',
    kubeId: '<',
    goBack: '<',
    projectId: '<',
    sendKubeTrack: '<',
  },
  template,
  controller,
};

export default component;
