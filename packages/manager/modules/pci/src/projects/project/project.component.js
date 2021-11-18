import controller from './project.controller';
import template from './project.html';

export default {
  bindings: {
    projectId: '<',
    quotas: '<',
    project: '<',
    user: '<',
    isTrustedZone: '<',
    getQuotaUrl: '<',
    getStateName: '<',
    steins: '<',
    customerRegions: '<',
    goToProject: '<',
    goToProjects: '<',
    goToProjectInactive: '<',
    goToRegion: '<',
  },
  controller,
  template,
};
