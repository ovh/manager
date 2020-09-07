import component from './telecom-sms-dashboard.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.dashboard', {
    url: '',
    views: {
      'smsInnerView@sms.service': {
        component: component.name,
      },
    },
    translations: {
      value: ['.', '../sms/compose'],
      format: 'json',
    },
  });
};
