import controller from './additional-ips.controller';
import template from './additional-ips.html';

export default {
  controller,
  template,
  bindings: {
    pciFeatureRedirect: '<',
    additionalIps: '<',
    activeTab: '<',
    currentActiveLink: '<',
    failoverIpsLink: '<',
    floatingIpsLink: '<',
    guideUrl: '<',
    projectId: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    goToRegion: '<',
    goToAdditionalIpOrderPage: '<',
  },
};
