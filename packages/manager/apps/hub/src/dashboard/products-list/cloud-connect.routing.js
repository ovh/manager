import { compact, get, map, set } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { component, resolves } from './config';
import { POP_MAP } from './products-list.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.ovh_cloud_connect', {
    url: `ovh_cloud_connect?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component,
    resolve: {
      ...resolves,
      ...ListLayoutHelper.stateResolves,
      apiPath: () => '/ovhCloudConnect',
      staticResources: () => true,
      resources: /* @ngInject */ ($http, apiPath, $translate) =>
        $http
          .get(apiPath, {
            headers: {
              'X-Pagination-Mode': 'CachedObjectList-Pages',
            },
          })
          .then(({ data }) => {
            compact(
              map(data, (product) => {
                set(product, 'pop', POP_MAP[get(product, 'pop')]);
                set(
                  product,
                  'bandwidth',
                  $translate.instant(
                    `manager_hub_dashboard_cloud_connect_${get(
                      product,
                      'bandwidth',
                    )
                      .split('')
                      .pop()}`,
                    {
                      bandwidth: parseInt(get(product, 'bandwidth'), 10),
                    },
                  ),
                );
              }),
            );
            return data;
          }),
      productType: () => 'OVH_CLOUD_CONNECT',
    },
    atInternet: {
      rename: 'app::dashboard::products::ovh_cloud_connect',
    },
  });
};
