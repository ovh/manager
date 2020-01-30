import get from 'lodash/get';

import { MENU } from './navbar.constants';

export default class {
  /* @ngInject */
  constructor($q, $rootScope, $translate, REDIRECT_URLS) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.REDIRECT_URLS = REDIRECT_URLS;
  }

  getLinks(products) {
    return MENU.map((item) => {
      const element = {
        ...item,
        title: this.$translate.instant(item.name),
      };

      if (item.urlKey) {
        element.url = get(this.REDIRECT_URLS, item.urlKey);
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
