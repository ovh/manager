import { MENU } from './sidebar.constant';

export default class Sidebar {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
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
      })),
    }));
  }
}
