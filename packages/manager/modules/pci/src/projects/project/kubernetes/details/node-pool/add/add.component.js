import controller from './add.controller';
import template from './add.html';

const component = {
  bindings: {
    antiAffinityMaxNodes: '<',
    autoscaling: '<',
    region: '<',
    goBack: '<',
    kubeId: '<',
    projectId: '<',
    cancelLink: '<',
    sendKubeTrack: '<',
  },
  controller,
  template,
};

export default component;
