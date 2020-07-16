import { get, pick } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { urlQueryParams, params, component, resolves } from './config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.vrack', {
    url: `vrack?${urlQueryParams}`,
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
      productType: /* @ngInject */ () => 'VRACK',
      apiPath: /* @ngInject */ () => '/vrack',
      schema: /* @ngInject */ ($http, apiPath) =>
        $http.get(`${apiPath}.json`).then(({ data }) => data),
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/vracks', {
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
      loadRow: /* @ngInject */ (products) => (service) => ({
        ...service,
        serviceName: service.id,
        managerLink: get(
          products.find(({ resource }) => resource.name === service.id),
          'url',
        ),
      }),
    },
    atInternet: {
      rename: 'app::dashboard::products::vrack',
    },
  });
};
