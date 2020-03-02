import angular from 'angular';

import isNil from 'lodash/isNil';

import { ACTIONS, LINKS } from './project.constants';

export default class ProjectController {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $uibModal,
    atInternet,
    coreConfig,
    OvhApiCloudProject,
    sidebarVisible,
    user,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.sidebarVisible = sidebarVisible;
    this.loading = false;
    this.user = user;

    this.actions = ACTIONS.filter(
      ({ regions }) =>
        isNil(regions) || regions.includes(coreConfig.getRegion()),
    );
    this.links = LINKS;
  }

  $onInit() {
    this.isSidebarOpen = false;
    this.loading = true;

    this.$scope.$on('sidebar:open', () => {
      this.isSidebarOpen = true;
      this.$timeout(() => angular.element('#sidebar-focus').focus());
    });

    return this.OvhApiCloudProject.v6()
      .get({
        serviceName: this.$stateParams.projectId,
      })
      .$promise.then((project) => {
        this.project = project;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
