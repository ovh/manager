import template from './convert-to-line.html';
import controller from './convert-to-line.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.convertToLine', {
    url: '/convert',
    views: {
      'aliasView@telecom.telephony.billingAccount.alias': {
        template,
        controller,
        controllerAs: 'AliasConvertCtrl',
      },
    },
  });
};
