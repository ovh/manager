import filter from 'lodash/filter';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.catalog', {
    url: '/catalog',
    component: 'hubCatalog',
    resolve: {
      products: /* @ngInject */ (catalog) =>
        filter(catalog.data, ({ category }) => category),
      categories: /* @ngInject */ (products) => uniq(map(products, 'category')),
      universes: /* @ngInject */ (products) => uniq(map(products, 'universe')),
    },
  });
};
