import component from './telecom-sms-batches-history-details-delete.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.history.details.delete', {
    params: {
      outgoing: {},
    },
    views: {
      modal: {
        component: component.name,
      },
    },
    resolve: {
      deleteOutgoing: /* @ngInject */ ($http, serviceName) => (outgoingId) =>
        $http({
          url: `/sms/${serviceName}/outgoing/${outgoingId}`,
          method: 'DELETE',
        }),
      outgoing: /* @ngInject */ ($transition$) =>
        $transition$.params().outgoing,
    },
    layout: 'modal',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
