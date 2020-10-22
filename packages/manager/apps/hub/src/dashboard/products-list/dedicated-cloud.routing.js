import { compact, get, map, merge, pick } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { urlQueryParams, params, component, resolves } from './config';

const routingData = {
  params,
  component,
  resolve: {
    ...resolves,
    ...pick(ListLayoutHelper.stateResolves, [
      'onListParamsChange',
      'filter',
      'sort',
      'sortOrder',
    ]),
    apiPath: /* @ngInject */ (resourcePath) =>
      resourcePath.replace(/\/\{[a-zA-Z]+\}/g, ''),
    schema: /* @ngInject */ ($http, apiPath) =>
      $http.get(`${apiPath}.json`).then(({ data }) => data),
    rows: /* @ngInject */ ($http, apiPath, products, propertyId) =>
      $http
        .get(apiPath, {
          headers: { 'X-Pagination-Mode': 'CachedObjectList-Pages' },
        })
        .then(({ data }) =>
          compact(
            map(products, (product) =>
              data.find(
                (service) =>
                  get(product, 'resource.name') === service[propertyId],
              ),
            ),
          ),
        ),
    paginationNumber: /* @ngInject */ ($transition$) =>
      $transition$.paramsChanged().filter && !$transition$.paramsChanged().page
        ? 1
        : $transition$.params().page,
    paginationSize: /* @ngInject */ ($transition$) =>
      $transition$.params().pageSize,
    paginationTotalCount: /* @ngInject */ (rows) => rows.length,
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
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state(
      'app.dashboard.dedicated_cloud',
      merge({}, routingData, {
        url: `dedicated_cloud?${urlQueryParams}`,
        resolve: {
          productType: () => 'DEDICATED_CLOUD',
        },
      }),
    )
    .state(
      'app.dashboard.essentials',
      merge({}, routingData, {
        url: `essentials?${urlQueryParams}`,
        resolve: {
          productType: () => 'ESSENTIALS',
        },
      }),
    );
};
