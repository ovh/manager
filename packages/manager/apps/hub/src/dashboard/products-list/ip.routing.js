import { get } from 'lodash-es';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { component, resolves } from './config';
import { genericProductResolve } from './routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.ip_service', {
    url: `ip_service?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component,
    resolve: {
      ...resolves,
      ...genericProductResolve,
      getServiceNameLink: /* @ngInject */ (products, propertyId) => (service) =>
        get(
          products.find(
            ({ resource }) => resource.name === `ip-${service[propertyId]}`,
          ),
          'url',
        ),
      productType: () => 'IP_SERVICE',
    },
    atInternet: {
      rename: 'app::dashboard::products::ip-service',
    },
  });
};
