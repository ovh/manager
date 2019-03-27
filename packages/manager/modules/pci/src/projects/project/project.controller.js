import { ACTIONS, LINKS } from './project.constants';

export default class ProjectController {
  /* @ngInject */
  constructor($stateParams, OvhApiCloudProject) {
    this.$stateParams = $stateParams;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.loading = false;

    this.actions = ACTIONS;
    this.links = LINKS;

    this.$ngInit();
  }

  $ngInit() {
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
