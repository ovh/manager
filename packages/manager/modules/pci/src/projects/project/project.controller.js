import isNil from 'lodash/isNil';

import { ACTIONS, LINKS } from './project.constants';
import { LEGACY_URLS } from './legacy-forward/forward.constants';

import controller from './legacy-forward/forward.controller';
import template from './legacy-forward/forward.html';

export default class ProjectController {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $uibModal,
    atInternet,
    coreConfig,
    OvhApiCloudProject,
    sidebarVisible,
    user,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.sidebarVisible = sidebarVisible;
    this.loading = false;
    this.user = user;

    this.actions = ACTIONS.filter(
      ({ regions }) => isNil(regions) || regions.includes(coreConfig.getRegion()),
    );
    this.links = LINKS;
    this.LEGACY_URL = LEGACY_URLS[coreConfig.getRegion()];
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

  goToLegacy() {
    this.atInternet.trackClick({
      name: 'public-cloud_menu_back-to-cloud',
      type: 'action',
    });
    return this.$uibModal.open({
      template,
      controller,
      controllerAs: '$ctrl',
    });
  }
}
