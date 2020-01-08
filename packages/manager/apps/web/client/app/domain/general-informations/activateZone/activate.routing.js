export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.information.zoneActivate', {
    url: '/activate',
    views: {
      modal: {
        component: 'domainZoneActivate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });

  $stateProvider.state('app.domain.alldom.information.zoneActivate', {
    url: '/activate',
    views: {
      modal: {
        component: 'domainZoneActivate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });
};
