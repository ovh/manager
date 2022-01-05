import controller from './scale.controller';
import template from './scale.template.html';

const component = {
  bindings: {
    autoscaling: '<',
    goBack: '<',
    kubeId: '<',
    nodePool: '<',
    nodePoolId: '<',
    nodePoolName: '<',
    projectId: '<',
    sendKubeTrack: '<',
    getKubeApiErrorId: '<',
    getQuotaBuildUrl: '<',
  },
  controller,
  template,
};

export default component;
