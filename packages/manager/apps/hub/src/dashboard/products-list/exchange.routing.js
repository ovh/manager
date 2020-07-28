import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { component, resolves } from './config';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.email_exchange_service', {
    url: `email_exchange_service?${ListLayoutHelper.urlQueryParams}`,
    params: ListLayoutHelper.stateParams,
    component,
    resolve: {
      ...resolves,
      staticResources: () => true,

      productType: /* @ngInject */ () => 'EMAIL_EXCHANGE_SERVICE',
      apiPath: /* @ngInject */ () => '/email/exchange',
      resources: /* @ngInject */ ($http) =>
        $http
          .get('/exchanges', {
            serviceType: 'aapi',
          })
          .then(({ data }) => data),
    },
    atInternet: {
      rename: 'app::dashboard::products::email-exchange-service',
    },
  });
};
