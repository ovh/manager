import template from './convert.html';
import controller from './convert.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.convert',
    {
      url: '/convert',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          controller,
          controllerAs: 'LineConvertCtrl',
        },
      },
    },
  );
};
