import { PRODUCT_TYPE } from '../list/list-domain-layout.constants';
import { CONTACT_MANAGEMENT_TRACKING } from './contact.constants';

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
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage(CONTACT_MANAGEMENT_TRACKING.PAGE);
    },
  });
};
