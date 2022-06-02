import controller from './additional-ips.controller';
import template from './additional-ips.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    additionalIps: '<',
    instances: '<',
    guideUrl: '<',
    projectId: '<',
    additionalIp: '<',
    onListParamChange: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    additionalIpsRegions: '<',
    goToRegion: '<',
    goToAdditionalIpOrderPage: '<',
  },
};
