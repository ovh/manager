import includes from 'lodash/includes';
import isUndefined from 'lodash/isUndefined';
import { MENU } from './sidebar.constant';

import template from './legacy-forward/forward.html';
import controller from './legacy-forward/forward.controller';

export default class Sidebar {
  /* @ngInject */
  constructor($translate, $uibModal, atInternet, coreConfig) {
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;

    this.REGION = coreConfig.getRegion();
  }

  getSidebarLinks(stateParams) {
    return [
      ...MENU.map(item => ({
        name: item.translation,
        title: this.$translate.instant(item.translation),
        subLinks: item.subitems.map(subitem => ({
          name: subitem.translation,
          title: this.$translate.instant(subitem.translation),
          ...subitem.options,
          stateParams,
        })).filter(({ regions }) => includes(regions, this.REGION) || isUndefined(regions)),
      })),
      {
        name: 'back-to-cloud',
        title: this.$translate.instant('cloud_sidebar_public_cloud_project_forward_legacy'),
        click: () => this.goToLegacy(),
      },
    ];
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
