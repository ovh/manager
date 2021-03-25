const commonResolves = {
  serviceName: /* @ngInject */ ($transition$) =>
    $transition$.params().productId,

  serviceOption: /* @ngInject */ (serviceName, DomainDnsZoneActivateService) =>
    DomainDnsZoneActivateService.getServiceOption(serviceName),

  goBack: /* @ngInject */ (goToZone) => goToZone,
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.zone.activate', {
    url: '/activate',
    component: 'domainZoneActivate',
    resolve: commonResolves,
  });

  $stateProvider.state('app.alldom.domain.zone.activate', {
    url: '/activate',
    component: 'domainZoneActivate',
    resolve: commonResolves,
  });
};
