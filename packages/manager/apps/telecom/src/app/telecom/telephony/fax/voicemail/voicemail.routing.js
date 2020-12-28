import template from './voicemail.html';
import controller from './voicemail.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.voicemail', {
    url: '/voicemail',
    views: {
      faxInnerView: {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
  });
};
