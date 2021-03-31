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
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.region = coreConfig.getRegion();

    const filterByRegion = (list) =>
      list.filter(
        ({ regions }) =>
          isNil(regions) || regions.includes(coreConfig.getRegion()),
      );

    this.actions = filterByRegion(ACTIONS);
    this.links = filterByRegion(LINKS);
  }

  $onInit() {
    this.isSidebarOpen = false;

    this.$scope.$on('sidebar:open', () => {
      this.isSidebarOpen = true;
      this.$timeout(() => angular.element('#sidebar-focus').focus());
    });

    this.projectQuotaAboveThreshold = this.quotas.find(
      (quota) => quota.quotaAboveThreshold,
    );
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
