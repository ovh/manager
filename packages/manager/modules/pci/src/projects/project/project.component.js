import controller from './project.controller';
import template from './project.html';

export default {
  bindings: {
    projectId: '<',
    serviceId: '<',
    quotas: '<',
    project: '<',
    projects: '<',
    user: '<',
    pciFeatures: '<',
    isTrustedZone: '<',
    pciFeatureRedirect: '<',
    links: '<',
    actions: '<',
    getQuotaUrl: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    goToProject: '<',
    goToProjects: '<',
    goToProjectInactive: '<',
    goToRegion: '<',
    onCreateProjectClick: '<',
    guideUrl: '<',
    vouchersCreditDetails: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    isMenuSidebarVisible: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '<',
    discoveryPromotionVoucherAmount: '<',
    activateDiscovery: '<',
  },
  controller,
  template,
};
