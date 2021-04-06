import controller from './upgrade-policy.controller';
import template from './upgrade-policy.html';

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
