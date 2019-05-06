import { ACTIONS, LINKS } from './project.constants';

export default class ProjectController {
  /* @ngInject */
  constructor($scope, $state, $stateParams, $transitions, OvhApiCloudProject) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$transitions = $transitions;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.loading = false;

    this.actions = ACTIONS;
    this.links = LINKS;

    this.$ngInit();
  }

  $ngInit() {
    this.loading = true;
    this.isSidebarOpen = false;

    this.$scope.$on('sidebar:toggle', () => {
      this.isSidebarOpen = !this.isSidebarOpen;
    });

    this.$scope.$on('navbar:toggle', () => {
      if (this.isSidebarOpen) {
        this.isSidebarOpen = false;
      }
    });

    this.$transitions.onStart({}, () => {
      this.isSidebarOpen = false;
    });

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
