import controller from './alias.controller';
import template from './alias.html';
import templateMain from './alias.main.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias', {
    url: '/alias/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        template,
      },
      'aliasView@telecom.telephony.billingAccount.alias': {
        template: templateMain,
        controller,
        controllerAs: '$ctrl',
      },
    },
    redirectTo: 'telecom.telephony.billingAccount.alias.dashboard',
  });
};
