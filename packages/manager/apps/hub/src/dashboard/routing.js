import { get, map, reverse, sortBy } from 'lodash-es';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/?expand',
    params: {
      expand: {
        value: null,
        squash: true,
        dynamic: true,
      },
    },
    resolve: {
      services: /* @ngInject */ ($http) =>
        $http
          .get('/hub/services', {
            serviceType: 'aapi',
          })
          .then((data) => data.data.data.services),
      products: /* @ngInject */ ($q, services) => {
        return $q.resolve(
          reverse(
            sortBy(
              map(services.data?.data, (service, productType) => ({
                ...service,
                productType,
              })),
              'count',
            ),
          ),
        );
      },
      trackingPrefix: () => 'hub::dashboard',
      expandProducts: /* @ngInject */ ($state) => (expand) =>
        $state.go('.', {
          expand,
        }),
      expand: /* @ngInject */ ($transition$) => $transition$.params().expand,
      hideBreadcrumb: () => true,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('manager_hub_dashboard'),
      callFeatureAvailabilty: /* @ngInject */ (ovhFeatureFlipping) => {
        const featuresName = [
          'hub:banner-hub-invite-customer-siret',
          'hub:popup-hub-invite-customer-siret',
          'hub:banner-iam-invite',
          'hub:banner-iam-ga-availability',
          'hub:banner-rbx1-eol',
        ];
        return ovhFeatureFlipping
          .checkFeatureAvailability(featuresName)
          .then((features) => {
            return features;
          });
      },
    },
    resolvePolicy: {
      async: 'NOWAIT',
    },
    componentProvider: /* @ngInject */ (order, services) => {
      return !get(services, 'data.count') && !order
        ? 'hubOrderDashboard'
        : 'hubDashboard';
    },
  });

  $urlRouterProvider.otherwise('/');
};
