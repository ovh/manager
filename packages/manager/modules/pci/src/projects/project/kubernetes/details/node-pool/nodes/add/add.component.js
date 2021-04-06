import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    antiAffinityMaxNodes: '<',
    cancelLink: '<',
    goBack: '<',
    goToProjectQuota: '<',
    kubeId: '<',
    flavor: '<',
    maxInstances: '<',
    nodeCount: '<',
    nodePoolName: '<',
    nodePoolId: '<',
    projectId: '<',
    quotas: '<',
    nodePool: '<',
    sendKubeTrack: '<',
  },
  controller,
  template,
};

export default component;
