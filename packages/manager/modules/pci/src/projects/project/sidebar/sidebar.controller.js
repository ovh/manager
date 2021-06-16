import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import set from 'lodash/set';

import { getMenu, UNIVERSE } from './sidebar.constant';

export default class SidebarController {
  /* @ngInject */

  constructor(
    $q,
    $translate,
    $rootScope,
    $scope,
    $stateParams,
    $transitions,
    atInternet,
    coreConfig,
    coreURLBuilder,
    OvhApiCloudProject,
    ovhFeatureFlipping,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$transitions = $transitions;
    this.$rootScope = $rootScope;
    this.$scope = $scope;

    this.$stateParams = $stateParams;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.ovhFeatureFlipping = ovhFeatureFlipping;

    this.isOpen = false;
    this.isLoading = false;
    this.isDisplayingProjectsList = false;

    this.REGION = coreConfig.getRegion();
    this.UNIVERSE = UNIVERSE;

    this.CONFIG_MENU = getMenu({
      DBAAS_LOGS_URL: coreURLBuilder.buildURL('dedicated', '#/dbaas/logs'),
    });
  }

  toggleProjectsList() {
    this.isDisplayingProjectsList = !this.isDisplayingProjectsList;
  }

  setProject(serviceName) {
    if (isEmpty(serviceName)) {
      return null;
    }

    this.isLoading = true;

    return this.OvhApiCloudProject.v6()
      .get({
        serviceName,
      })
      .$promise.then((project) => {
        this.project = project;
      })
      .finally(() => {
        this.$rootScope.$broadcast('sidebar:loaded');
        this.isLoading = false;
      });
  }

  findFeatureToCheck() {
    return this.CONFIG_MENU.reduce((features, item) => {
      return [
        ...features,
        item.feature,
        ...item.subitems.map((subitem) => subitem.feature),
      ].filter((feature) => !!feature);
    }, []);
  }

  $onInit() {
    const featuresName = this.findFeatureToCheck();
    this.ovhFeatureFlipping
      .checkFeatureAvailability(featuresName)
      .then((features) => {
        const isItemAvailable = (regions, feature) =>
          (isNil(regions) || this.coreConfig.isRegion(regions)) &&
          (!feature || features.isFeatureAvailable(feature));

        this.MENU = this.CONFIG_MENU.filter(({ regions, feature }) =>
          isItemAvailable(regions, feature),
        ).map((menu) => {
          set(
            menu,
            'subitems',
            menu.subitems.filter(({ regions, feature }) =>
              isItemAvailable(regions, feature),
            ),
          );
          return menu;
        });
      });
    let currentProjectId = this.$stateParams.projectId;
    this.setProject(this.$stateParams.projectId);
    this.$transitions.onSuccess({}, () => {
      if (currentProjectId !== this.$stateParams.projectId) {
        this.setProject(this.$stateParams.projectId);
        currentProjectId = this.$stateParams.projectId;
      }
      this.isDisplayingProjectsList = false;
    });
  }

  onMenuItemClick({ id }) {
    this.atInternet.trackClick({
      name: `public-cloud_menu_${id}`,
      type: 'action',
    });
    this.onClick();
  }
}
