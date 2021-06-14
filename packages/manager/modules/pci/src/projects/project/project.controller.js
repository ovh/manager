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
    ovhFeatureFlipping,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.region = coreConfig.getRegion();
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    const filterByRegion = (list) =>
      list.filter(
        ({ regions }) => isNil(regions) || coreConfig.isRegion(regions),
      );

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

    const featuresName = ProjectController.findFeatureToCheck(ACTIONS);
    this.ovhFeatureFlipping
      .checkFeatureAvailability(featuresName)
      .then((features) => {
        const isItemAvailable = (regions, feature) =>
          (isNil(regions) || this.coreConfig.isRegion(regions)) &&
          (!feature || features.isFeatureAvailable(feature));
        this.actions = ACTIONS.filter(({ regions, feature }) =>
          isItemAvailable(regions, feature),
        );
      });
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  /**
   * finds and returns array of features
   * @param {Array} items
   */
  static findFeatureToCheck(items) {
    return items.reduce((features, item) => {
      return [...features, item.feature].filter((feature) => !!feature);
    }, []);
  }
}
