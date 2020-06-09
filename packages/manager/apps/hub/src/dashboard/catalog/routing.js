import { filter, map, uniq } from 'lodash-es';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.catalog', {
    url: 'catalog',
    component: 'hubCatalog',
    resolve: {
      products: /* @ngInject */ (catalog) =>
        filter(catalog.data, ({ category }) => category),
      universes: /* @ngInject */ (products) =>
        uniq(map(products, 'universe')).sort(),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('manager_hub_catalog_breadcrumb'),
    },
  });
};
