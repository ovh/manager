import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import set from 'lodash/set';

import { MENU } from './sidebar.constant';

export default class SidebarController {
  /* @ngInject */

  constructor(
    $translate,
    $rootScope,
    $stateParams,
    $transitions,
    atInternet,
    coreConfig,
    OvhApiServices,
    OvhApiCloudProject,
  ) {
    this.$translate = $translate;
    this.$transitions = $transitions;
    this.$rootScope = $rootScope;

    this.$stateParams = $stateParams;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.OvhApiServices = OvhApiServices;
    this.OvhApiCloudProject = OvhApiCloudProject;

    this.isOpen = false;
    this.isLoading = false;
    this.isDisplayingProjectsList = false;

    this.REGION = coreConfig.getRegion();
  }

  toggleProjectsList() {
    this.isDisplayingProjectsList = !this.isDisplayingProjectsList;
  }

  setProject(serviceName) {
    if (isEmpty(serviceName)) {
      return null;
    }

    this.isLoading = true;

    return this.OvhApiCloudProject
      .v6()
      .get({
        serviceName,
      })
      .$promise
      .then((project) => {
        this.project = project;
      })
      .finally(() => {
        this.$rootScope.$broadcast('sidebar:loaded');
        this.isLoading = false;
      });
  }

  $onInit() {
    this.MENU = MENU
      .filter(({ regions }) => isNil(regions) || this.coreConfig.isRegion(regions))
      .map((menu) => {
        set(menu, 'subitems', menu
          .subitems
          .filter(({ regions }) => isNil(regions) || this.coreConfig.isRegion(regions)));
        return menu;
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
  }
}
