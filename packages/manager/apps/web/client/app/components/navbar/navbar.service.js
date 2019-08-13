import _ from 'lodash';

import { MENU } from './navbar.constants';

export default class Navbar {
  /* @ngInject */
  constructor($translate, $q, WucProducts) {
    this.$translate = $translate;
    this.$q = $q;
    this.WucProducts = WucProducts;
  }

  sortProducts(products) {
    return this.$q.when(_.mapValues(products, product => _.sortBy(
      product,
      item => _.get(item, 'displayName', item.name),
    )));
  }

  getResponsiveLinks() {
    return this.WucProducts.getProductsByType()
      .then(products => _.omit(products, ['state', 'messages']))
      .then(products => (_.values(products).length > 500
        ? []
        : (this.sortProducts(products)
          .then(sortedProducts => ({
            ...sortedProducts,
            hostings: _.filter(products.hostings, { type: 'HOSTING' }),
            privateDatabase: _.filter(products.hostings, { type: 'PRIVATE_DATABASE' }),
          }))
          .then(sortedProducts => MENU.map(item => ({
            ...item,
            title: this.$translate.instant(item.title),
            subLinks: this.getSublinks(item, sortedProducts),
          }))))));
  }

  getSublinks(section, products) {
    if (section.name === 'domains') {
      return this.getDomainsMenu(products.domains);
    }

    if (section.name === 'emails') {
      return _.sortBy([
        ...Navbar.getProductsMenu('email.domain', products.emails),
        ...Navbar.getProductsMenu('email-pro', products.emailProMXPlan),
      ], email => email.title.toLowerCase());
    }

    if (section.name === 'microsoft') {
      return this.getMicrosoftMenu(products);
    }

    return Navbar.getProductsMenu(section.id, products[section.name]);
  }


  static getProductsMenu(categoryName, products) {
    return _.map(products, product => ({
      title: product.displayName || product.name,
      state: `app.${categoryName}`,
      stateParams: {
        productId: product.name,
      },
    }));
  }

  getDomainsMenu(domains) {
    return [{
      title: this.$translate.instant('navigation_left_all_domains'),
      state: 'app.domain.all',
    }, {
      title: this.$translate.instant('navigation_left_all_domains_operations'),
      state: 'app.domain.operation',
    },
    ..._.map(domains, domain => ({
      name: domain.name,
      title: domain.displayName || domain.name,
      state: domain.type === 'ZONE' ? 'app.domain.dns-zone' : 'app.domain.product.information',
      stateParams: {
        productId: domain.name,
      },
      subLinks: domain.subProducts
        ? _.map(domain.subProducts, subDomain => ({
          name: subDomain.name,
          title: subDomain.displayName,
          state: 'app.domain.alldom',
          stateParams: {
            allDom: domain.displayName,
            productId: subDomain.name,
          },
        }))
        : null,
    })),
    ];
  }

  getMicrosoftMenu(products) {
    const exchangeProductTypes = {
      EXCHANGE_PROVIDER: 'app.microsoft.exchange.provider',
      EXCHANGE_DEDICATED: 'app.microsoft.exchange.dedicated',
      EXCHANGE_DEDICATEDCLUSTER: 'app.microsoft.exchange.dedicatedCluster',
    };

    // Exchange products
    const exchangeProducts = _.sortBy(
      products.exchanges,
      elt => (elt.displayName || elt.name || '').toLowerCase(),
    );
    const exchangeLinks = _.map(exchangeProducts, elt => ({
      name: elt.name,
      title: elt.displayName || elt.name,
      state: _(exchangeProductTypes[elt.type]).isString() ? exchangeProductTypes[elt.type] : 'app.microsoft.exchange.hosted',
      stateParams: {
        organization: elt.organization,
        productId: elt.name,
      },
    }));

    // Office products
    const officeProducts = _.sortBy(
      products.licenseOffice,
      elt => (elt.displayName || elt.name || '').toLowerCase(),
    );
    const officeLinks = _.map(officeProducts, elt => ({
      name: elt.name,
      title: elt.displayName || elt.name,
      state: 'app.microsoft.office.product',
      stateParams: {
        serviceName: elt.name,
      },
    }));

    // SharePoint products
    const sharepointProducts = _.sortBy(
      products.sharepoints,
      elt => (elt.displayName || elt.name || '').toLowerCase(),
    );
    const sharepointLinks = _.map(sharepointProducts, elt => ({
      name: elt.name,
      title: elt.displayName || elt.name,
      state: 'app.microsoft.sharepoint.product',
      stateParams: {
        exchangeId: elt.exchangeId,
        productId: elt.name,
      },
    }));

    // Build Microsoft menu
    return [{
      name: 'microsoft.exchange',
      title: this.$translate.instant('navigation_left_exchange'),
      subLinks: exchangeLinks,
    }, {
      name: 'microsoft.office',
      title: this.$translate.instant('navigation_left_office'),
      subLinks: officeLinks,
    }, {
      name: 'microsoft.sharepoint',
      title: this.$translate.instant('navigation_left_sharepoint'),
      subLinks: sharepointLinks,
    }];
  }
}
