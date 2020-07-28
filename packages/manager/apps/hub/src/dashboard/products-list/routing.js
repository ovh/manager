import { find, get } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { component, resolves } from './config';

export const genericProductResolve = {
  apiPath: /* @ngInject */ (resourcePath) =>
    resourcePath.replace(/\/\{[a-zA-Z]+\}/g, ''),
  schema: /* @ngInject */ ($http, resourcePath) =>
    $http
      .get('/')
      .then(({ data: schema }) =>
        find(schema.apis, ({ path }) =>
          new RegExp(`^${path}/`).test(resourcePath),
        ),
      )
      .then(({ path }) => $http.get(`${path}.json`))
      .then(({ data }) => data),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.products', {
    url: `:product?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component,
    redirectTo: (trans) =>
      trans
        .injector()
        .getAsync('products')
        .then((products) => (products ? false : 'app.dashboard')),
    resolve: {
      ...resolves,
      ...genericProductResolve,
      productType: /* @ngInject */ ($transition$) =>
        $transition$.params().product.toUpperCase(),
    },
    atInternet: {
      rename: /* @ngInject */ ($state) =>
        // We're limited with the possible injection as we listen to onBefore hook
        `app::dashboard::products::${get(
          $state.transition.params(),
          'product',
          '',
        ).replace(/_/g, '-')}`,
    },
  });
};
