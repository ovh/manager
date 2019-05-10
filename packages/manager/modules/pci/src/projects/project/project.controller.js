import { ACTIONS, LINKS } from './project.constants';

export default class ProjectController {
  /* @ngInject */
  constructor($state, $stateParams, $transitions, OvhApiCloudProject, sidebarVisible) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.sidebarVisible = sidebarVisible;
    this.loading = false;

    this.actions = ACTIONS;
    this.links = LINKS;
  }

  $onInit() {
    this.loading = true;

    return this.OvhApiCloudProject
      .v6()
      .get({
        serviceName: this.$stateParams.projectId,
      })
      .$promise
      .then((project) => {
        this.project = project;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
