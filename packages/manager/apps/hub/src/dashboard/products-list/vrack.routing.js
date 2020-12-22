import { get } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { component, resolves } from './config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.vrack', {
    url: `vrack?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component,
    resolve: {
      ...resolves,
      productType: /* @ngInject */ () => 'VRACK',
      apiPath: /* @ngInject */ () => '/vrack',
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/vracks', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
      staticResources: () => true,
      getServiceNameLink: /* @ngInject */ (products) => (service) =>
        get(
          products.find(({ resource }) => resource.name === service.id),
          'url',
        ),

      loadResource: /* @ngInject */ () => (service) => ({
        ...service,
        serviceName: service.id,
      }),
    },
    atInternet: {
      rename: 'app::dashboard::products::vrack',
    },
  });
};
