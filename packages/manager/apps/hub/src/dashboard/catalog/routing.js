import { filter, map, uniq } from 'lodash-es';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.catalog', {
    url: 'catalog?q&universes&categories',
    component: 'hubCatalog',
    params: {
      q: {
        value: null,
        squash: true,
        dynamic: true,
        type: 'string',
      },
      universes: {
        value: '[]',
        squash: true,
        dynamic: true,
      },
      categories: {
        value: '[]',
        squash: true,
        dynamic: true,
      },
    },
    resolve: {
      products: /* @ngInject */ (catalog) =>
        filter(catalog.data, ({ category }) => category),
      universes: /* @ngInject */ (products) =>
        uniq(map(products, 'universe')).sort(),
      selectedUniverses: /* @ngInject */ ($transition$) =>
        JSON.parse($transition$.params().universes),
      selectedCategories: /* @ngInject */ ($transition$) =>
        JSON.parse($transition$.params().categories),
      searchText: /* @ngInject */ ($transition$) => $transition$.params().q,
      onSearch: /* @ngInject */ ($state) => (params) => $state.go('.', params),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('manager_hub_catalog_breadcrumb'),
    },
  });
};
