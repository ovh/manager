import component from './telecom-sms-batches-history-details-delete.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.details.delete', {
    url: '/deleteSms?smsId',
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
      outgoing: /* @ngInject */ ($transition$, outgoingSms) =>
        outgoingSms.find(
          ({ id }) => id === parseInt($transition$.params().smsId, 10),
        ),
      goBackToDetails: /* @ngInject */ ($state) => (options) =>
        $state.go('sms.service.batches.details', {}, options),
    },
    layout: 'modal',
  });
};
