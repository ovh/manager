import controller from './project.controller';
import template from './project.html';

export default {
  bindings: {
    projectId: '<',
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
  },
  controller,
  template,
};
