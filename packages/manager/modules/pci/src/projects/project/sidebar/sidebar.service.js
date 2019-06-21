import includes from 'lodash/includes';
import isUndefined from 'lodash/isUndefined';
import { MENU } from './sidebar.constant';

export default class Sidebar {
  /* @ngInject */
  constructor($translate, atInternet, coreConfig) {
    this.$translate = $translate;
    this.atInternet = atInternet;

    this.REGION = coreConfig.getRegion();
  }

  getSidebarLinks(stateParams) {
    return [
      ...MENU.map(item => ({
        name: item.title,
        title: item.title,
        subLinks: item.subitems.map(subitem => ({
          name: subitem.title,
          title: subitem.title,
          ...subitem.options,
          stateParams,
        })).filter(({ regions }) => includes(regions, this.REGION) || isUndefined(regions)),
      })),
    ];
  }
}
