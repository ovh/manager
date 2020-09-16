import component from '../../../components/contacts-choice/contacts-choice.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.create.phonebooks-contacts', {
    url: '/phonebooks-contacts',
    params: {
      model: {},
    },
    resolve: {
      model: /* @ngInject */ ($transition$) => $transition$.params().model,
      getPhonebookContacts: /* @ngInject */ (iceberg, serviceName) => (
        bookKey,
      ) =>
        iceberg(`/sms/${serviceName}/phonebooks/${bookKey}/phonebookContact`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute()
          .$promise.then(({ data }) => data),
    },
    views: {
      modal: {
        component: component.name,
      },
    },
    layout: 'modal',
  });
};
