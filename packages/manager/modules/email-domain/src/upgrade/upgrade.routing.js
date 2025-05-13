import sortBy from 'lodash/sortBy';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.upgrade', {
    url: '/upgrade',
    component: 'webEmailDomainUpgrade',
    resolve: {
      goBack: /* @ngInject */ (goToEmailDomain) => goToEmailDomain,
      offers: /* @ngInject */ (EmailDomainService, serviceName) =>
        EmailDomainService.getOffers(serviceName).then((offers) =>
          sortBy(offers, 'duration.prices.withoutTax.value'),
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_upgrade'),
    },
  });
};
