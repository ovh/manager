import _ from 'lodash';
import { DEBT_ALL } from './edit.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.contacts.services.edit', {
    url: '/edit?service',
    views: {
      modal: {
        component: 'accountContactsServiceEdit',
      },
    },
    layout: 'modal',
    resolve: {
      billLink: /* @ngInject */ $state => $state.href('app.account.billing.main.history.pay-debt', { debtId: DEBT_ALL }),
      changeContact: /* @ngInject */
        AccountContactsService => service => AccountContactsService.changeContact(service),
      goBack: /* @ngInject */ goToContacts => goToContacts,
      service: /* @ngInject */ (
        category,
        getServiceInfos,
        serviceName,
        services,
      ) => getServiceInfos(_.find(services, { serviceName, category })),
      serviceName: /* @ngInject */ $transition$ => $transition$.params().service,
    },
  });
};
