import pick from 'lodash/pick';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { urlQueryParams, params, component, resolves } from './config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.exchange', {
    url: `email_exchange_service?${urlQueryParams}`,
    params,
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
