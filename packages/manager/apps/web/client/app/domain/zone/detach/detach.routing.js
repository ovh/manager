const commonResolves = {
  goBack: /* @ngInject */ (goToZone) => goToZone,
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.zone.detach', {
    url: '/detach',
    component: 'domainZoneDetach',
    resolve: commonResolves,
  });

  $stateProvider.state('app.domain.alldom.zone.detach', {
    url: '/detach',
    component: 'domainZoneDetach',
    resolve: commonResolves,
  });
};
