export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.information.zoneActivate', {
    url: '/activate',
    component: 'domainZoneActivate',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });

  $stateProvider.state('app.domain.alldom.information.zoneActivate', {
    url: '/activate',
    component: 'domainZoneActivate',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });
};
