export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('app.dedicated-server', {
      url: '',
      component: 'dedicatedServerTabComponent',
      redirectTo: 'app.dedicated-server.index',
      resolve: {
        featureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
          ovhFeatureFlipping.checkFeatureAvailability([
            'dedicated-server:order',
            'dedicated-server:ecoRangeOrderSectionDedicated',
            'billing:autorenew2016Deployment',
            'dedicated-server:cluster',
            'dedicated-servers',
          ]),
        isMultiAZAvailable: /* @ngInject */ (
          $q,
          $http,
          featureAvailability,
        ) => {
          return $q
            .all({
              isMultiAZFeatureAvailable: featureAvailability?.isFeatureAvailable(
                'dedicated-server:cluster',
              ),
              clusters: $http.get('/dedicated/cluster'),
            })
            .then(
              ({ isMultiAZFeatureAvailable, clusters }) =>
                isMultiAZFeatureAvailable && clusters.data.length !== 0,
            );
        },
        currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
          $state.href($state.current.name, $transition$.params()),
        allServersLink: /* @ngInject */ ($transition$, $state) =>
          $state.href('app.dedicated-server.index', $transition$.params()),
        clustersLink: /* @ngInject */ ($transition$, $state) =>
          $state.href('app.dedicated-server.cluster', $transition$.params()),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_servers_title'),
        breadcrumbPrefix: /* @ngInject */ (
          $injector,
          $q,
          coreURLBuilder,
          $translate,
          featureAvailability,
        ) => {
          const name = $translate.instant('dedicated_servers_title');
          if (!featureAvailability?.isFeatureAvailable('dedicated-servers')) {
            return null;
          }
          if ($injector.has('shellClient')) {
            return $injector
              .get('shellClient')
              .navigation.getURL('dedicated-servers', '#/')
              .then((url) => {
                return {
                  replaceElements: true,
                  prefixes: [
                    {
                      name,
                      url,
                    },
                  ],
                };
              });
          }
          return $q.when({
            replaceElements: true,
            prefixes: [
              {
                name,
                url: coreURLBuilder.buildURL('dedicated-servers', '#/'),
              },
            ],
          });
        },
      },
    })
    .state('app.dedicated-cluster', {
      url: '',
      template: '<div ui-view="rootView"></div>',
      redirectTo: 'app.dedicated-cluster.index',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_servers_title'),
      },
    });
};
