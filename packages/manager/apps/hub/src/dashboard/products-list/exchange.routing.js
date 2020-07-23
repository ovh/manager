import { pick } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { component, resolves } from './config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.email_exchange_service', {
    url: `email_exchange_service?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component,
    resolve: {
      ...resolves,
      ...pick(ListLayoutHelper.stateResolves, [
        'onListParamsChange',
        'filter',
        'sort',
        'sortOrder',
        'columns',
      ]),
      productType: /* @ngInject */ () => 'EMAIL_EXCHANGE_SERVICE',
      apiPath: /* @ngInject */ () => '/email/exchange',
      schema: /* @ngInject */ ($http, apiPath) =>
        $http.get(`${apiPath}.json`).then(({ data }) => data),
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/exchanges', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      staticResources: () => true,
      paginationNumber: /* @ngInject */ ($transition$) =>
        $transition$.paramsChanged().filter &&
        !$transition$.paramsChanged().page
          ? 1
          : $transition$.params().page,
      paginationSize: /* @ngInject */ ($transition$) =>
        $transition$.params().pageSize,
      paginationTotalCount: /* @ngInject */ (resources) => resources.length,
    },
    atInternet: {
      rename: 'app::dashboard::products::email-exchange-service',
    },
  });
};
