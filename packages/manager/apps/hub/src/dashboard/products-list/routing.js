import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
// import { BillingService } from '@ovh-ux/manager-models';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.products', {
    url: ':product',
    component: 'hubProductListing',
    resolve: {
      productType: /* @ngInject */ ($transition$) =>
        $transition$.params().product.toUpperCase(),
      resourcePath: /* @ngInject */ (productType, services) => {
        const products = services[productType];
        return get(head(get(products, 'data')), 'route.path');
      },
      products: /* @ngInject */ ($http, resourcePath) => {
        const basePath = resourcePath.replace(/\/\{[a-zA-Z]+\}/g, '');
        return $http
          .get(basePath, {
            headers: {
              'X-Pagination-Mode': 'CachedobjectList-Pages',
            },
          })
          .then(({ data }) => data);
      },
      schema: /* @ngInject */ ($http, resourcePath) =>
        $http
          .get('/')
          .then(({ data: schema }) =>
            find(schema.apis, ({ path }) =>
              new RegExp(`^${path}`).test(resourcePath),
            ),
          )
          .then(({ path }) => $http.get(`${path}.json`))
          .then(({ data }) => data),
      dataModel: /* @ngInject */ (resourcePath, schema) => {
        const model = get(
          find(get(find(schema.apis, { path: resourcePath }), 'operations'), {
            httpMethod: 'GET',
          }),
          'responseType',
        );
        return schema.models[model];
      },
      columns: /* @ngInject */ (dataModel) =>
        map(dataModel.properties, (value, name) => ({
          title: name,
          property: name,
        })),
    },
  });
};
