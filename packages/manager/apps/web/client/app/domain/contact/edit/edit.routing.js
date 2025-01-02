export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.contact.edit', {
    url: '/edit-contact/:contactId/',
    params: {
      contactId: null,
    },
    component: 'domainZoneDashboardContactEdit',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate, $transition$) =>
        [
          $translate.instant('domain_tab_CONTACT_edit'),
          $transition$.params().productId,
        ].join(' '),
      contactId: /* @ngInject */ ($transition$) =>
        $transition$.params().contactId,
      contactInformations: /* @ngInject */ (contactId, ContactService) =>
        ContactService.getDomainContactInformations(contactId),
      goBack: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.domain.product.contact');

        if (message) {
          promise.then(() => Alerter[type](message, 'dashboardContact'));
        }

        return promise;
      },
    },
    atInternet: {
      rename:
        'web::domain::domain-name::domain-name::funnel::edit_holder-contact',
    },
  });
};
