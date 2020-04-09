import get from 'lodash/get';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { urlQueryParams, params, component, resolves } from './config';
import { genericProductResolve } from './routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.ip_service', {
    url: `ip_service?${urlQueryParams}`,
    params,
    component,
    resolve: {
      ...resolves,
      ...ListLayoutHelper.stateResolves,
      ...genericProductResolve,
      loadRow: /* @ngInject */ (products, propertyId) => (service) => ({
        ...service,
        managerLink: get(
          products.find(
            ({ resource }) => resource.name === `ip-${service[propertyId]}`,
          ),
          'url',
        ),
      }),
      productType: () => 'IP_SERVICE',
    },
    atInternet: {
      rename: 'app::dashboard::products::ip-service',
    },
  });
};
