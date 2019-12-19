export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.zone.activate', {
    url: '/activate',
    views: {
      modal: {
        component: 'domainZoneActivate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToZone) => goToZone,
    },
  });

  $stateProvider.state('app.domain.alldom.zone.activate', {
    url: '/activate',
    views: {
      modal: {
        component: 'domainZoneActivate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToZone) => goToZone,
    },
  });
};
