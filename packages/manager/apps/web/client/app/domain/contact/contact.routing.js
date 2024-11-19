import ContactService from './contact.service';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.contact', {
    url: '/contact-management',
    views: {
      domainView: {
        component: 'domainZoneDashboardContact',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('contact_management'),
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone'),
    },
  });
  $stateProvider.state('app.domain.edit-contact', {
    url: '/edit-contact',
    params: {
      contactId: null,
      domainName: null,
    },
    component: 'domainZoneDashboardContactEdit',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate, $transition$) =>
        [$translate.instant('domain_tab_CONTACT_edit'), $transition$.params().domainName].join(' '),
      contactId: /* @ngInject */ ($transition$) => $transition$.params().contactId,
      contactInformations: /* @ngInject */ ($transition$, ContactService) =>
        ContactService.getDomainContactInformations($transition$.params().contactId),
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.contact'),
    },
  });
};
