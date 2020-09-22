import component from './telecom-sms-batches-history-details-delete.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.details.delete', {
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
      goBackToDetails: /* @ngInject */ ($state) => (options) =>
        $state.go('sms.service.batches.details', {}, options),
    },
    layout: 'modal',
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
