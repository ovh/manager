import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

import { getMenu, UNIVERSE, USER_TYPES_MAP } from './sidebar.constant';

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
    OvhApiMe,
    OvhApiServices,
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
    this.OvhApiMe = OvhApiMe;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.OvhApiServices = OvhApiServices;
    this.OvhApiCloudProjectServiceInfos = OvhApiCloudProject.ServiceInfos();
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

  isAvailableToUser(subItem) {
    const allowedUsers = map(subItem.users, (userType) =>
      get(this.serviceInfo, get(USER_TYPES_MAP, userType)),
    );
    return !subItem.users || includes(allowedUsers, this.user.nichandle);
  }

  toggleProjectsList() {
    this.isDisplayingProjectsList = !this.isDisplayingProjectsList;
  }

  setProject(serviceName) {
    if (isEmpty(serviceName)) {
      return null;
    }

    this.isLoading = true;

    return this.$q
      .all([this.getProjectInfo(serviceName), this.getServiceInfo(serviceName)])
      .then(([project, serviceInfo]) => {
        this.project = project;
        this.serviceInfo = serviceInfo;
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

  getProjectInfo(serviceName) {
    return this.OvhApiCloudProject.v6().get({ serviceName }).$promise;
  }

  getServiceInfo(serviceName) {
    return this.OvhApiCloudProjectServiceInfos.v6().get({
      serviceName,
    }).$promise;
  }

  onMenuItemClick({ id }) {
    this.atInternet.trackClick({
      name: `public-cloud_menu_${id}`,
      type: 'action',
    });
    this.onClick();
  }
}
