const commonResolves = {
  autoPayWithPreferredPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
    ovhPaymentMethod.hasDefaultPaymentMethod(),

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

  $stateProvider.state('app.domain.alldom.zone.activate', {
    url: '/activate',
    component: 'domainZoneActivate',
    resolve: commonResolves,
  });
};
