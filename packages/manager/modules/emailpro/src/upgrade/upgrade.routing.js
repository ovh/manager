import sortBy from 'lodash/sortBy';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('mxplan.dashboard.upgrade', {
    url: '/upgrade?domain',
    component: 'webEmailDomainUpgrade',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().domain,
      goBack: /* @ngInject */ (goToEmailPro) => goToEmailPro,
      offers: /* @ngInject */ (EmailDomainService, serviceName) =>
        EmailDomainService.getOffers(serviceName).then((offers) =>
          sortBy(offers, 'duration.prices.withoutTax.value'),
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('emailpro_upgrade'),
    },
  });
};
