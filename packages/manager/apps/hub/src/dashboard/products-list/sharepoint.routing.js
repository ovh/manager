import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { component, resolves } from './config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.ms_services_sharepoint', {
    url: `ms_services_sharepoint?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component,
    resolve: {
      ...resolves,
      productType: () => 'MS_SERVICES_SHAREPOINT',
      apiPath: () => '/msServices',
      resourcePath: () => '/msServices/{serviceName}/sharepoint',
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/sharepoints', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      staticResources: () => true,
    },
    atInternet: {
      rename: 'app::dashboard::products::ms-services-sharepoint',
    },
  });
};
