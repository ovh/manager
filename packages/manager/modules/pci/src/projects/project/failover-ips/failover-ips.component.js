import controller from './failover-ips.controller';
import template from './failover-ips.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    failoverIps: '<',
    instances: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    projectId: '<',
    failoverIp: '<',
    onListParamChange: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    failoverIpsRegions: '<',
    goToRegion: '<',
  },
};
