import controller from './project.controller';
import template from './project.html';

export default {
  bindings: {
    projectId: '<',
    quotas: '<',
    project: '<',
    user: '<',
    getQuotaUrl: '<',
    goToProject: '<',
    goToProjects: '<',
    goToProjectInactive: '<',
  },
  controller,
  template,
};
