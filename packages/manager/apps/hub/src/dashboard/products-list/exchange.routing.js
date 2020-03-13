import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { urlQueryParams, params, component, resolves } from './config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.exchange', {
    url: `email_exchange_service?${urlQueryParams}`,
    // prevent reloading all resolves as we already have the data but save to url for bookmarking
    params: mapValues(params, (param) => ({
      ...param,
      dynamic: true,
    })),
    component,
    resolve: {
      ...resolves,
      ...pick(ListLayoutHelper.stateResolves, ['onListParamsChange', 'filter']),
      productType: /* @ngInject */ () => 'EMAIL_EXCHANGE_SERVICE',
      apiPath: /* @ngInject */ () => '/email/exchange',
      schema: /* @ngInject */ ($http, apiPath) =>
        $http.get(`${apiPath}.json`).then(({ data }) => data),
      rows: /* @ngInject */ ($http) =>
        $http
          .get('/exchanges', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      paginationNumber: /* @ngInject */ ($transition$) =>
        $transition$.paramsChanged().filter &&
        !$transition$.paramsChanged().page
          ? 1
          : $transition$.params().page,
      paginationSize: /* @ngInject */ ($transition$) =>
        $transition$.params().pageSize,
      paginationTotalCount: /* @ngInject */ (rows) => rows.length,
    },
  });
};
