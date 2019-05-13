import includes from 'lodash/includes';
import isUndefined from 'lodash/isUndefined';
import { MENU } from './sidebar.constant';

export default class Sidebar {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;

    this.REGION = coreConfig.getRegion();
  }

  getSidebarLinks(stateParams) {
    return MENU.map(item => ({
      name: item.translation,
      title: this.$translate.instant(item.translation),
      subLinks: item.subitems.map(subitem => ({
        name: subitem.translation,
        title: this.$translate.instant(subitem.translation),
        state: subitem.options.state,
        stateParams,
      })).filter(({ regions }) => includes(regions, this.REGION) || isUndefined(regions)),
    }));
  }
}
