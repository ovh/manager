import { pick } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { urlQueryParams, params, component, resolves } from './config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.ms_services_sharepoint', {
    url: `ms_services_sharepoint?${urlQueryParams}`,
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
      productType: () => 'MS_SERVICES_SHAREPOINT',
      apiPath: () => '/msServices',
      resourcePath: () => '/msServices/{serviceName}/sharepoint',
      schema: /* @ngInject */ ($http, apiPath) =>
        $http.get(`${apiPath}.json`).then(({ data }) => data),
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/sharepoints', {
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
      rename: 'app::dashboard::products::ms-services-sharepoint',
    },
  });
};
