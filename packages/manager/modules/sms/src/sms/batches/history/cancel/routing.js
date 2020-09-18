import component from './telecom-sms-batches-history-cancel.component';

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
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
