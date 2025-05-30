import { PRODUCT_TYPE } from '../list/list-domain-layout.constants';
import { CONTACT_MANAGEMENT_TRACKING } from './contact.constants';

export default /* @ngInject */ ($stateProvider) => {
  const state = {
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
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage(CONTACT_MANAGEMENT_TRACKING.PAGE);
    },
  };

  $stateProvider.state('app.domain.product.contact', {
    ...state,
    resolve: {
      ...state.resolve,
      goToContactEdit: /* @ngInject */ ($state) => (contactIdParam = '') => {
        return $state.go('app.domain.product.contact.edit', {
          contactId: contactIdParam,
        });
      },
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone'),
    },
  });

  $stateProvider.state('app.alldom.domain.contact', {
    ...state,
    resolve: {
      ...state.resolve,
      goToContactEdit: /* @ngInject */ ($state) => (contactIdParam = '') => {
        return $state.go('app.alldom.domain.contact.edit', {
          contactId: contactIdParam,
        });
      },
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.alldom.domain.zone'),
    },
  });
};
