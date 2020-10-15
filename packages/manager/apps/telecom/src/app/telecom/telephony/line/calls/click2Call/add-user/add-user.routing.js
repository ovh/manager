import template from './add-user.html';
import controller from './add-user.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.click2call.addUser',
    {
      url: '/add',
      views: {
        'lineView@telecom.telephony.billingAccount.line': {
          template,
          controller,
          controllerAs: 'Click2CallAddUserCtrl',
        },
      },
    },
  );
};
