import controller from './add.controller';
import template from './add.html';
import './add.scss';

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
    loadQuotas: '<',
    regions: '<',
    versions: '<',
    sendKubeTrack: '<',
    getKubeApiErrorId: '<',
    getQuotaBuildUrl: '<',
  },
  controller,
  template,
};
