import template from './language.html';
import controller from './language.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.language', {
    url: '/language',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        controller,
        controllerAs: 'LineLanguage',
      },
    },
  });
};
