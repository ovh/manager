import { PRODUCT_TYPE } from '../list/list-domain-layout.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.contact', {
    url: '/contact-management',
    views: {
      domainView: {
        component: 'domainZoneDashboardContact',
      },
    },
    resolve: {
      contactsManagementUrl: /* @ngInject */ (coreURLBuilder, $transition$) =>
        coreURLBuilder.buildURL('dedicated', '#/contacts/services/edit', {
          serviceName: $transition$.params().productId,
          category: PRODUCT_TYPE,
          service: $transition$.params().productId,
          categoryType: PRODUCT_TYPE,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('contact_management'),
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone'),
    },
    atInternet: {
      rename:
        'web::domain::domain-name::domain-name::dashboard::contact-management',
    },
  });
};
