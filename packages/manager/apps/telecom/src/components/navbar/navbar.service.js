import get from 'lodash/get';

import { MENU } from './navbar.constants';

export default class {
  /* @ngInject */
  constructor($q, $rootScope, $translate, URLS) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.URLS = URLS;
  }

  getLinks(products) {
    return MENU.map((item) => {
      const element = {
        ...item,
        title: this.$translate.instant(item.name),
      };

      if (item.urlKey) {
        element.url = get(this.URLS, item.urlKey);
      }

      if (!item.urlKey && !item.state) {
        element.subLinks = products[item.name];
      }

      return element;
    });
  }

  // build responsive menu
  getResponsiveLinks() {
    return this.$q.when(this.getLinks({}));
  }
}
