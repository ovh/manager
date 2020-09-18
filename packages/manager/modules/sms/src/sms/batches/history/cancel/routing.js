import component from '../../cancel/telecom-sms-batches-cancel.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.history.cancel', {
    params: {
      batch: {},
    },
    views: {
      modal: {
        component: component.name,
      },
    },
    resolve: {
      batch: /* @ngInject */ ($transition$) => $transition$.params().batch,
    },
    layout: 'modal',
  });
};
