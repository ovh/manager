import find from 'lodash/find';

import { DEBT_ALL } from './edit.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.contacts.services.edit', {
    url: '/edit?service&categoryType',
    views: {
      modal: {
        component: 'accountContactsServiceEdit',
      },
    },
    layout: 'modal',
    resolve: {
      billLink: /* @ngInject */ ($state) =>
        $state.href('app.account.billing.main.history.pay-debt', {
          debtId: DEBT_ALL,
        }),
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
          find(services, { serviceName, serviceType: categoryType }),
        ),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().service,
      categoryType: /* @ngInject */ ($transition$) =>
        $transition$.params().categoryType,
    },
  });
};
