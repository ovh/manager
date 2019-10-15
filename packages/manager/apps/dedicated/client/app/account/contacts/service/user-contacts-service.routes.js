export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.contacts.services', {
    url: '/services?serviceName&category',
    component: 'accountContactsService',
    translations: {
      format: 'json',
      value: ['.', '..'],
    },
    resolve: {
      category: /* @ngInject */ $transition$ => $transition$.params().category,
      editContacts: /* @ngInject */ $state => service => $state.go('app.account.contacts.services.edit', { service: service.serviceName, category: service.category }),
      getServiceInfos: /* @ngInject */
        AccountContactsService => service => AccountContactsService.getServiceInfos(service)
          .then(serviceInfos => ({
            ...service,
            ...serviceInfos,
          })),
      goToContacts: /* @ngInject */ ($state, $timeout, Alerter) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('app.account.contacts.services', {}, {
          reload,
        });

        if (message) {
          promise.then(() => $timeout(() => Alerter.set(`alert-${type}`, message, null)));
        }

        return promise;
      },

      services: /* @ngInject */ AccountContactsService => AccountContactsService.getServices(),
    },
  });
};
