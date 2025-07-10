import find from 'lodash/find';

import { DEBT_ALL, REPLICABLE_SERVICE_TYPES } from './edit.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('account.contacts.services.edit', {
    url: '/edit?service&categoryType',
    views: {
      modal: {
        component: 'accountContactsServiceEdit',
      },
    },
    layout: 'modal',
    resolve: {
      billLink: /* @ngInject */ (coreURLBuilder) =>
        coreURLBuilder.buildURL(
          'dedicated',
          `#/billing/history/debt/:debtId/pay`,
          {
            debtId: DEBT_ALL,
          },
        ),
      /* @ngInject */
      changeContact: (AccountContactsService) => (service) =>
        AccountContactsService.changeContact(service),
      goBack: /* @ngInject */ (goToContacts) => goToContacts,
      service: /* @ngInject */ (
        categoryType,
        getServiceInfos,
        serviceName,
        services,
      ) =>
        getServiceInfos(
          find(services, { serviceName, category: categoryType }),
        ),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().service,
      categoryType: /* @ngInject */ ($transition$) =>
        $transition$.params().categoryType,
      breadcrumb: () => null,
      relatedReplicableService: /* @ngInject */ (
        categoryType,
        serviceName,
        services,
        getServiceInfos,
      ) => {
        if (!REPLICABLE_SERVICE_TYPES.includes(categoryType)) return null;

        const related = services.find(
          ({ serviceName: name, category }) =>
            name === serviceName &&
            category !== categoryType &&
            REPLICABLE_SERVICE_TYPES.includes(category),
        );

        return related ? getServiceInfos(related) : null;
      },
    },
  });
};
