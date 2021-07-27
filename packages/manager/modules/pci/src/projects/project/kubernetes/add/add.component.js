import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    addPrivateNetworksLink: '<',
    antiAffinityMaxNodes: '<',
    autoscaling: '<',
    highestVersion: '<',
    goBack: '<',
    projectId: '<',
    privateNetworks: '<',
    quotas: '<',
    regions: '<',
    versions: '<',
    sendKubeTrack: '<',
  },
  controller,
  template,
};
