import component from './telecom-sms-batches.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches', {
    url: '/batches',
    views: {
      'smsInnerView@sms.service': {
        component: component.name,
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
