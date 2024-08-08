import controller from './edit-network.controller';
import template from './edit-network.template.html';

const component = {
  bindings: {
    kubeId: '<',
    goBack: '<',
    projectId: '<',
    sendKubeTrack: '<',
    cluster: '<',
    privateNetworks: '<',
  },
  template,
  controller,
};

export default component;
