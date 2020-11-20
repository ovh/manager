import { compact, get, map, merge } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { component, resolves } from './config';

const routingData = {
  params: ListLayoutHelper.stateParams,
  component,
  resolve: {
    ...resolves,
    ...ListLayoutHelper.stateResolves,
    apiPath: () => '/dedicatedCloud',
    staticResources: () => true,
    resources: /* @ngInject */ ($http, apiPath, products, propertyId) =>
      $http
        .get(apiPath, {
          headers: {
            'X-Pagination-Mode': 'CachedObjectList-Pages',
          },
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
        url: `dedicated_cloud?${ListLayoutHelper.urlQueryParams}`,
        resolve: {
          productType: () => 'DEDICATED_CLOUD',
        },
      }),
    )
    .state(
      'app.dashboard.essentials',
      merge({}, routingData, {
        url: `essentials?${ListLayoutHelper.urlQueryParams}`,
        resolve: {
          productType: () => 'ESSENTIALS',
        },
      }),
    );
};
