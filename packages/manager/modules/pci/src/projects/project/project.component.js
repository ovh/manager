import controller from './project.controller';
import template from './project.html';

export default {
  bindings: {
    projectId: '<',
    quotas: '<',
    project: '<',
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
    guideTrackingSectionTags: '<',
    trackClick: '<',
  },
  controller,
  template,
};
